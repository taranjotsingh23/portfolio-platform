/*
  Validates .env and the MongoDB connection. Never prints secret values.
  Usage:
    npm run check             check everything
    npm run check -- --no-db  skip the database connection test
    npm run check:fill-jwt    generate JWT_SECRET into .env if it is empty, then check
*/
const fs = require('fs');
const crypto = require('crypto');
const { ENV_PATH, loadEnv } = require('./_env');

const args = process.argv.slice(2);
const SKIP_DB = args.includes('--no-db');
const FILL_JWT = args.includes('--fill-jwt');

function fillJwt() {
  let text = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const match = text.match(/^JWT_SECRET=(.*)$/m);
  if (match && match[1].trim()) {
    console.log('JWT_SECRET is already set; left unchanged.');
    return;
  }
  const secret = crypto.randomBytes(32).toString('hex');
  if (match) {
    text = text.replace(/^JWT_SECRET=.*$/m, () => 'JWT_SECRET=' + secret);
  } else {
    text += (text && !text.endsWith('\n') ? '\n' : '') + 'JWT_SECRET=' + secret + '\n';
  }
  fs.writeFileSync(ENV_PATH, text);
  console.log('JWT_SECRET generated and saved to .env (value not displayed).');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Each rule returns a problem description, or null when the value looks fine
const RULES = [
  {
    key: 'MONGODB_URI',
    required: true,
    check: (v) => {
      if (!/^mongodb(\+srv)?:\/\//.test(v)) return 'should start with mongodb+srv://';
      if (/<[^>]*password[^>]*>/i.test(v)) return 'still contains the password placeholder; replace it with the real password';
      if (!/\/\/[^:/@]+:[^@]+@/.test(v)) return 'is missing username:password@';
      return null;
    },
  },
  { key: 'MONGODB_DB', required: false, check: (v) => (/^[A-Za-z0-9_-]{1,38}$/.test(v) ? null : 'use letters, numbers, dashes or underscores only') },
  {
    key: 'ADMIN_PASSWORD',
    required: true,
    check: (v) => {
      if (v.length < 16) return 'is shorter than 16 characters; use a longer passphrase';
      if (/[#$"'\s]/.test(v)) return 'contains # $ quotes or spaces, which can break .env parsing; use letters, numbers and dashes';
      return null;
    },
  },
  { key: 'JWT_SECRET', required: true, check: (v) => (v.length >= 32 ? null : 'is shorter than 32 characters; run: npm run check:fill-jwt') },
  { key: 'RESEND_API_KEY', required: true, check: (v) => (/^re_\S{10,}$/.test(v) ? null : 'should start with re_') },
  { key: 'NOTIFY_EMAIL', required: true, check: (v) => (EMAIL_RE.test(v) ? null : 'is not a valid email address') },
  { key: 'DASHBOARD_TZ', required: false, check: (v) => { try { new Intl.DateTimeFormat('en-CA', { timeZone: v }); return null; } catch (e) { return 'is not a valid time zone name'; } } },
];

function scrub(message, uri) {
  let msg = String(message || '');
  if (uri) {
    msg = msg.split(uri).join('[uri]');
    const m = uri.match(/\/\/[^:/@]+:([^@]+)@/);
    if (m) msg = msg.split(m[1]).join('***');
  }
  return msg;
}

function hintFor(msg) {
  if (/auth|credentials|not authorized/i.test(msg)) return 'Check the database username and password in MONGODB_URI. Special characters in the password must be URL-encoded.';
  if (/ENOTFOUND|querySrv|EAI_AGAIN/i.test(msg)) return 'The cluster host name could not be found. Re-copy the connection string from Atlas and check your internet connection.';
  if (/timed out|Server selection|ECONNREFUSED|ReplicaSetNoPrimary/i.test(msg)) return 'Could not reach the cluster. In Atlas, Network Access must allow 0.0.0.0/0, and the cluster must not be paused.';
  if (/Invalid scheme|Invalid connection string|URI malformed|Invalid URL/i.test(msg)) return 'The connection string is malformed. Re-copy it from Atlas and URL-encode special characters in the password.';
  return 'See the message above.';
}

async function checkDb(uri, dbName) {
  let mongoose;
  try {
    mongoose = require('mongoose');
  } catch (e) {
    console.log('SKIPPED MongoDB connection (run npm install first)');
    return false;
  }
  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 8000 });
    await mongoose.connection.db.command({ ping: 1 });
    console.log('OK      MongoDB connection (ping succeeded, database "' + dbName + '")');
    return true;
  } catch (e) {
    const msg = scrub(e && e.message, uri);
    console.log('FAILED  MongoDB connection: ' + msg.slice(0, 300));
    console.log('        Hint: ' + hintFor(msg));
    return false;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

(async () => {
  if (FILL_JWT) fillJwt();

  const { exists, vars } = loadEnv();
  if (!exists) {
    console.log('.env was not found. Copy .env.example to .env first.');
    process.exitCode = 1;
  }

  let ok = exists;
  for (const rule of RULES) {
    const v = (vars[rule.key] || '').trim();
    if (!v) {
      if (rule.required) {
        console.log('MISSING ' + rule.key + ' (required)');
        ok = false;
      } else {
        console.log('default ' + rule.key + ' (empty, using the built-in default)');
      }
      continue;
    }
    const problem = rule.check(v);
    if (problem) {
      console.log('PROBLEM ' + rule.key + ' ' + problem);
      ok = false;
    } else {
      console.log('OK      ' + rule.key);
    }
  }

  if (ok && !SKIP_DB) {
    const dbOk = await checkDb(vars.MONGODB_URI.trim(), (vars.MONGODB_DB || 'portfolio').trim());
    ok = ok && dbOk;
  } else if (!ok && !SKIP_DB) {
    console.log('SKIPPED MongoDB connection (fix the items above first)');
  }

  console.log(ok ? '\nAll checks passed.' : '\nSome checks did not pass. Fix the items above and run: npm run check');
  process.exitCode = ok ? 0 : 1;
})();
