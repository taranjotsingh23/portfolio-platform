const { connect, getModels } = require('../lib/db');
const { json, clip, parseUA, geoCountry } = require('../lib/http');

const ID_RE = /^[A-Za-z0-9-]{8,64}$/;

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method Not Allowed' });
  if (!event.body || event.body.length > 4000) return json(400, { ok: false, error: 'Invalid body' });

  let p;
  try { p = JSON.parse(event.body); } catch (e) { return json(400, { ok: false, error: 'Invalid JSON' }); }
  if (!p || typeof p.visitorId !== 'string' || !ID_RE.test(p.visitorId)) {
    return json(400, { ok: false, error: 'Invalid visitorId' });
  }

  const headers = event.headers || {};
  const ua = headers['user-agent'] || '';
  const { bot, device, browser, os } = parseUA(ua);
  if (bot) return json(200, { ok: true, ignored: 'bot' }); // keep crawlers and link previews out of the stats

  const now = new Date();
  const visitorId = p.visitorId;
  const refHost = hostOf(p.referrer);
  const ownHost = String(headers.host || '').replace(/^www\./, '');
  const ref = clip(p.ref, 40);
  const source = ref ? ref.toLowerCase() : refHost && refHost !== ownHost ? refHost : 'direct';
  const country = geoCountry(event);
  const path = clip(p.path, 200) || '/';

  try {
    await connect();
    const { Visitor, VisitEvent } = getModels();

    const update = {
      $setOnInsert: { firstVisit: now, firstSource: source },
      $set: { lastVisit: now, lastSource: source, lastPath: path, device, browser, os, country, userAgent: clip(ua, 300) },
      $inc: { visitCount: 1 },
    };
    const options = { upsert: true, new: false, setDefaultsOnInsert: false };

    // new:false returns the document as it was BEFORE this update.
    // null means this visitor ID has never been seen before, so this is a NEW visitor.
    let previous;
    try {
      previous = await Visitor.findOneAndUpdate({ visitorId }, update, options).lean();
    } catch (err) {
      if (err && err.code === 11000) {
        previous = await Visitor.findOneAndUpdate({ visitorId }, update, options).lean(); // lost an upsert race
      } else throw err;
    }

    await VisitEvent.create({
      visitorId,
      timestamp: now,
      isNewVisitor: !previous,
      path,
      source,
      referrerHost: refHost,
      device,
      browser,
      os,
      country,
    });

    return json(200, { ok: true, isNew: !previous });
  } catch (err) {
    console.error('track error:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
};
