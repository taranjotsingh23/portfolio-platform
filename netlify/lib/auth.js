const crypto = require('crypto');

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== 'string') return false;
  const h = (s) => crypto.createHash('sha256').update(s).digest();
  return crypto.timingSafeEqual(h(input), h(expected));
}

function sign(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return body + '.' + sig;
}

function verify(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp && payload.exp > Date.now() ? payload : null;
  } catch (e) {
    return null;
  }
}

const issueToken = () => sign({ role: 'admin', exp: Date.now() + 12 * 60 * 60 * 1000 }); // 12 hours

function isAdmin(event) {
  const auth = (event.headers && event.headers.authorization) || '';
  return auth.startsWith('Bearer ') && verify(auth.slice(7)) !== null;
}

module.exports = { checkPassword, issueToken, isAdmin };
