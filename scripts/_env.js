const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');

function parseEnv(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return { exists: false, vars: {} };
  return { exists: true, vars: parseEnv(fs.readFileSync(ENV_PATH, 'utf8')) };
}

// Make .env values available as process.env (does not override variables already set)
function applyEnv() {
  const { vars } = loadEnv();
  Object.keys(vars).forEach((k) => {
    if (process.env[k] === undefined) process.env[k] = vars[k];
  });
}

module.exports = { ENV_PATH, parseEnv, loadEnv, applyEnv };
