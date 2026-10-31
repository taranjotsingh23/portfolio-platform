/*
  Automated checks against a running local server. Start it first with: npm run dev
  Usage: npm run smoke
  It creates a few records whose visitorId starts with "test-". Remove them with: npm run cleanup
*/
const BASE = (process.env.BASE_URL || 'http://localhost:8888').replace(/\/$/, '');
const ID = 'test-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
const FN = '/.netlify/functions/';

async function call(path, opts) {
  const res = await fetch(BASE + path, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) {}
  return { status: res.status, json, text };
}

const post = (path, body, headers) =>
  call(path, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
    body: JSON.stringify(body),
  });

function expect(cond, message) {
  if (!cond) throw new Error(message);
}

const tests = [
  ['Portfolio page loads', async () => {
    const r = await call('/');
    expect(r.status === 200, 'status ' + r.status);
    expect(r.text.includes('Get in Touch'), 'page content not found');
  }],
  ['Admin page loads', async () => {
    const r = await call('/admin/');
    expect(r.status === 200, 'status ' + r.status);
    expect(r.text.includes('Admin login'), 'page content not found');
  }],
  ['Track rejects an invalid visitor id', async () => {
    const r = await post(FN + 'track', { visitorId: 'x' });
    expect(r.status === 400, 'expected 400, got ' + r.status);
  }],
  ['Track ignores bots', async () => {
    const r = await post(FN + 'track', { visitorId: ID + '-bot' }, { 'User-Agent': 'Googlebot/2.1' });
    expect(r.status === 200 && r.json && r.json.ignored === 'bot', 'expected ignored bot, got ' + r.status + ' ' + r.text.slice(0, 120));
  }],
  ['Track records a NEW visitor (needs MongoDB)', async () => {
    const r = await post(FN + 'track', { visitorId: ID, path: '/', referrer: null });
    expect(r.status !== 500, 'server error: MongoDB probably unreachable. Run: npm run check');
    expect(r.status === 200 && r.json && r.json.ok === true, 'unexpected response ' + r.status + ' ' + r.text.slice(0, 120));
    expect(r.json.isNew === true, 'expected isNew=true, got ' + r.json.isNew);
  }],
  ['Track records a RETURNING visit', async () => {
    const r = await post(FN + 'track', { visitorId: ID, path: '/', referrer: null });
    expect(r.status === 200 && r.json && r.json.ok === true, 'unexpected response ' + r.status);
    expect(r.json.isNew === false, 'expected isNew=false, got ' + r.json.isNew);
  }],
  ['Contact rejects an empty form', async () => {
    const r = await post(FN + 'contact', { name: '', email: '', message: '', elapsed: 5000 });
    expect(r.status === 400, 'expected 400, got ' + r.status);
  }],
  ['Contact quietly accepts a honeypot submission', async () => {
    const r = await post(FN + 'contact', { name: 'Bot', email: 'bot@example.test', message: 'spam spam spam', website: 'http://spam.test', elapsed: 5000 });
    expect(r.status === 200 && r.json && r.json.ok === true, 'unexpected response ' + r.status);
  }],
  ['Admin login rejects a wrong password', async () => {
    const r = await post(FN + 'admin-login', { password: 'definitely-not-the-password' });
    expect(r.status !== 500, 'ADMIN_PASSWORD or JWT_SECRET is missing. Run: npm run check');
    expect(r.status === 401, 'expected 401, got ' + r.status);
  }],
  ['Admin stats requires a token', async () => {
    const r = await call(FN + 'admin-stats');
    expect(r.status === 401, 'expected 401, got ' + r.status);
  }],
  ['Admin stats rejects a forged token', async () => {
    const r = await call(FN + 'admin-stats', { headers: { Authorization: 'Bearer abc.def' } });
    expect(r.status === 401, 'expected 401, got ' + r.status);
  }],
  ['Admin messages requires a token', async () => {
    const r = await call(FN + 'admin-messages');
    expect(r.status === 401, 'expected 401, got ' + r.status);
  }],
];

(async () => {
  try {
    await fetch(BASE + '/');
  } catch (e) {
    console.log('Cannot reach ' + BASE + '. Start the server first with: npm run dev');
    process.exit(1);
  }

  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn();
      console.log('PASS  ' + name);
    } catch (e) {
      failed += 1;
      console.log('FAIL  ' + name + '\n        ' + e.message);
    }
  }
  console.log('\n' + (tests.length - failed) + ' of ' + tests.length + ' checks passed.');
  if (failed === 0) console.log('Test records were created under visitor ids starting with "test-". Remove them with: npm run cleanup');
  process.exitCode = failed ? 1 : 0;
})();
