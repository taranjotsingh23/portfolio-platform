const { json } = require('../lib/http');
const { checkPassword, issueToken } = require('../lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method Not Allowed' });
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return json(500, { ok: false, error: 'Server is not configured' });
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { ok: false, error: 'Invalid request' }); }

  if (!checkPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json(401, { ok: false, error: 'Wrong password' });
  }
  return json(200, { ok: true, token: issueToken() });
};
