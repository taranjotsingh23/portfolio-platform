const crypto = require('crypto');

const json = (statusCode, body, extra = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  body: JSON.stringify(body),
});

const clip = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function clientIp(event) {
  const h = event.headers || {};
  return h['x-nf-client-connection-ip'] || String(h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

// One-way hash so raw IPs are never stored
function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + '|' + (process.env.JWT_SECRET || '')).digest('hex').slice(0, 32);
}

function parseUA(ua) {
  const s = String(ua || '');
  const bot = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|headless|lighthouse|pingdom|uptime/i.test(s);
  const device = /ipad|tablet|android(?!.*mobile)/i.test(s) ? 'Tablet' : /mobi|android|iphone/i.test(s) ? 'Mobile' : 'Desktop';
  const browser = /edg\//i.test(s) ? 'Edge' : /opr\/|opera/i.test(s) ? 'Opera' : /chrome|crios/i.test(s) ? 'Chrome' : /firefox|fxios/i.test(s) ? 'Firefox' : /safari/i.test(s) ? 'Safari' : 'Other';
  const os = /windows/i.test(s) ? 'Windows' : /android/i.test(s) ? 'Android' : /iphone|ipad|ios/i.test(s) ? 'iOS' : /mac os|macintosh/i.test(s) ? 'macOS' : /linux/i.test(s) ? 'Linux' : 'Other';
  return { bot, device, browser, os };
}

// Best effort: Netlify may pass geo info as a base64 JSON header
function geoCountry(event) {
  const h = event.headers || {};
  try {
    if (h['x-nf-geo']) {
      const g = JSON.parse(Buffer.from(h['x-nf-geo'], 'base64').toString('utf8'));
      if (g && g.country) return g.country.name || g.country.code || null;
    }
  } catch (e) {}
  return h['x-country'] || null;
}

module.exports = { json, clip, escapeHtml, clientIp, hashIp, parseUA, geoCountry };
