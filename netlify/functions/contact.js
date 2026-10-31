const { connect, getModels } = require('../lib/db');
const { json, clip, clientIp, hashIp, escapeHtml } = require('../lib/http');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function sendNotification(m) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return { sent: false, error: 'email not configured' };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: m.email,
        subject: 'New portfolio message: ' + (m.subject || m.name),
        html:
          '<h3>New message from your portfolio</h3>' +
          '<p><b>Name:</b> ' + escapeHtml(m.name) + '<br><b>Email:</b> ' + escapeHtml(m.email) +
          '<br><b>Subject:</b> ' + escapeHtml(m.subject || '-') + '</p>' +
          '<p style="white-space:pre-wrap">' + escapeHtml(m.message) + '</p>',
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) return { sent: false, error: 'Resend ' + res.status + ': ' + (await res.text()).slice(0, 200) };
    return { sent: true, error: null };
  } catch (e) {
    return { sent: false, error: String(e.message || e).slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method Not Allowed' });
  if (!event.body || event.body.length > 10000) return json(400, { ok: false, error: 'Message too large.' });

  let p;
  try { p = JSON.parse(event.body); } catch (e) { return json(400, { ok: false, error: 'Invalid request.' }); }

  // Spam traps: a filled honeypot or an instant submit looks like a bot, so pretend it worked
  if (p.website) return json(200, { ok: true });
  if (typeof p.elapsed === 'number' && p.elapsed < 1500) return json(200, { ok: true });

  const name = clip(p.name, 80);
  const email = clip(p.email, 120);
  const subject = (clip(p.subject, 120) || '').replace(/[\r\n]+/g, ' ');
  const message = clip(p.message, 3000);

  if (!name || name.length < 2) return json(400, { ok: false, error: 'Please enter your name.' });
  if (!email || !EMAIL_RE.test(email)) return json(400, { ok: false, error: 'Please enter a valid email address.' });
  if (!message || message.length < 10) return json(400, { ok: false, error: 'Please write a message of at least 10 characters.' });

  try {
    await connect();
    const { Message } = getModels();

    const ipHash = hashIp(clientIp(event));
    const recent = await Message.countDocuments({ ipHash, createdAt: { $gte: new Date(Date.now() - 3600 * 1000) } });
    if (recent >= 5) return json(429, { ok: false, error: 'Too many messages. Please try again later.' });

    const doc = await Message.create({ name, email, subject, message, ipHash });

    const result = await sendNotification({ name, email, subject, message });
    await Message.updateOne({ _id: doc._id }, { $set: { emailSent: result.sent, emailError: result.error } });

    return json(200, { ok: true });
  } catch (err) {
    console.error('contact error:', err);
    return json(500, { ok: false, error: 'Something went wrong. Please try again or email me directly.' });
  }
};
