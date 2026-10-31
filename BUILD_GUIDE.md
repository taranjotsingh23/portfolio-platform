# Portfolio Platform: Build Guide for Claude Code

> **For you (Taranjot), 2 minutes of setup**
>
> 1. Create an empty folder called `portfolio-platform` and put this file inside it as `BUILD_GUIDE.md`.
> 2. Open that folder in VS Code, open the terminal (Ctrl + `), and run `claude`.
> 3. Paste this starter prompt:
>
> ```text
> Read BUILD_GUIDE.md completely. Then build the project exactly as it describes, phase by phase. Stop at every CHECKPOINT and wait for me. Never ask me to paste secrets into this chat: tell me which line of .env to fill in and I will do it myself in VS Code.
> ```
>
> 4. Keep these ready: your MongoDB Atlas connection string, your Resend API key, your profile photo, your CV PDF, and your favicon files from the old project.
> 5. Deploying to GitHub and Netlify is yours to do after the build. Part 7 has the exact steps.
>
> **Optional safety net:** create `.claude/settings.json` with the content below so Claude Code is never allowed to read your secrets file. This guide never needs Claude Code to read `.env`. If Claude Code reports the syntax as invalid, skip this.
>
> ```json
> {
>   "permissions": {
>     "deny": ["Read(./.env)"]
>   }
> }
> ```

---

# Instructions for Claude Code (everything below is addressed to you)

## Part 1. What you are building

One repository that deploys to one Netlify site:

| URL | What it is |
|---|---|
| `/` | Recruiter-facing portfolio for Taranjot Singh: About, Experience, Projects, Skills, Education, Achievements, Hobbies, and a contact form |
| `/admin/` | Password-protected analytics dashboard and message inbox |
| `/.netlify/functions/*` | Backend: visitor tracking, contact form, admin login, stats, messages, daily keep-alive |
| MongoDB Atlas | Database `portfolio` with collections `visitors`, `visitevents`, `messages` (created automatically on first write) |

How the data flows:

- **Visitor tracking.** The browser keeps a random visitor id in `localStorage` and sends one `POST /track` per browser session (refreshes do not count again). The server decides new vs returning: if that id was never seen before, the visit is a **new visitor**; otherwise it is a **returning visit**. Bots and link-preview crawlers are ignored. Do Not Track is respected. Raw IP addresses are never stored.
- **Contact form.** A message is validated, saved to MongoDB first, then emailed to the owner through Resend. If the email fails, the message is still safe in the database and the dashboard shows an "email not sent" tag.
- **Admin dashboard.** The owner signs in with `ADMIN_PASSWORD`; the server returns a signed 12-hour token; every admin endpoint verifies that token.
- **Keep-alive.** A scheduled function pings MongoDB once a day. Free Atlas clusters pause after a long period with no connections; this prevents that. It runs only on a deployed Netlify site, not locally.

## Part 2. Ground rules

1. **Create files exactly as written in Part 8.** Each file is a heading `### FILE: <path>` followed by one fenced code block. The file content is what is inside the fence, without the fence lines. Use your file-writing tool, not shell heredocs (they corrupt quotes on Windows). Write UTF-8, LF line endings, no BOM, one trailing newline.
2. **Do not change the code.** Do not rename, reformat, "improve", add dependencies or swap libraries. If you think something is wrong, finish the build, then list it in your final report with a proposed fix and let the user decide.
3. **Secrets.** Never print, echo, log, `cat`, read or commit the contents of `.env`, the MongoDB URI, the admin password, the Resend key or the JWT secret. Never ask the user to paste a secret into the chat. The user edits `.env` themselves in VS Code. Use `npm run check`, which reports only OK / MISSING / problem for each variable and never prints values.
4. **Do not touch git remotes or deploy.** Do not run `git push`, `git remote`, `netlify login`, `netlify link`, `netlify deploy` or `netlify init`. Running `git init` is optional and only if the user asks. Local `netlify dev` is the only Netlify command you run.
5. **Ask before installing globally.** `npm install` in the project is fine. If the Netlify CLI is missing, ask the user, then run `npm install -g netlify-cli`.
6. **Keep a task list** (one task per phase) and mark each done only after its verification passed.
7. **If a check fails,** fix the cause. Never weaken or skip a test to make it pass. If the cause is something only the user can fix (an Atlas setting, a wrong key), say exactly what to change and wait.
8. **Be brief.** After each phase say what was done in one or two sentences and what the user must do next, if anything.

## Part 3. File manifest

| # | Path | Purpose |
|---|---|---|
| 1 | `package.json` | Scripts and the single dependency (`mongoose`) |
| 2 | `netlify.toml` | Publish folder, functions folder, daily schedule, security headers |
| 3 | `.gitignore` | Keeps `.env` and `node_modules` out of git |
| 4 | `.env.example` | Names of the secrets (no values) |
| 5 | `README.md` | Short project readme |
| 6 | `scripts/_env.js` | Tiny `.env` reader shared by the helper scripts |
| 7 | `scripts/check-setup.js` | Validates `.env` and the MongoDB connection without printing secrets |
| 8 | `scripts/smoke-test.js` | Automated checks against the local server |
| 9 | `scripts/cleanup-test-data.js` | Deletes the test visitors the smoke test created |
| 10 | `netlify/lib/db.js` | MongoDB connection and the three schemas |
| 11 | `netlify/lib/http.js` | Response, validation and user-agent helpers |
| 12 | `netlify/lib/auth.js` | Admin password check and signed tokens |
| 13 | `netlify/functions/track.js` | Records new and returning visits |
| 14 | `netlify/functions/contact.js` | Saves and emails contact messages |
| 15 | `netlify/functions/admin-login.js` | Exchanges the admin password for a token |
| 16 | `netlify/functions/admin-stats.js` | Dashboard numbers and charts data |
| 17 | `netlify/functions/admin-messages.js` | List, mark and delete messages |
| 18 | `netlify/functions/keep-alive.js` | Daily database ping |
| 19 | `public/index.html` | The portfolio |
| 20 | `public/robots.txt` | Keeps `/admin/` out of search engines |
| 21 | `public/css/styles.css` | Portfolio styles (light and dark) |
| 22 | `public/js/tracker.js` | Visit tracker |
| 23 | `public/js/main.js` | Theme toggle, menu, active link, contact form |
| 24 | `public/assets/favicon/site.webmanifest` | Web app manifest |
| 25 | `public/admin/index.html` | Dashboard page |
| 26 | `public/admin/admin.css` | Dashboard styles |
| 27 | `public/admin/admin.js` | Dashboard logic |

Files you cannot create (the user supplies them in Phase 5): `public/assets/img/profile.png`, `public/assets/pdf/Taranjot-Singh-CV.pdf`, and the favicon images in `public/assets/favicon/`.

Final tree:

```text
portfolio-platform/
├── .env                      (created in Phase 3, never committed)
├── .env.example
├── .gitignore
├── BUILD_GUIDE.md
├── README.md
├── netlify.toml
├── package.json
├── scripts/       _env.js  check-setup.js  smoke-test.js  cleanup-test-data.js
├── netlify/
│   ├── lib/        db.js  http.js  auth.js
│   └── functions/  track.js  contact.js  admin-login.js  admin-stats.js
│                   admin-messages.js  keep-alive.js
└── public/
    ├── index.html  robots.txt
    ├── css/styles.css
    ├── js/tracker.js  main.js
    ├── admin/  index.html  admin.css  admin.js
    └── assets/  img/profile.png  pdf/Taranjot-Singh-CV.pdf  favicon/…
```

## Part 4. Phases

### Phase 0. Preflight

1. Run `node -v`. It must be 18 or newer; if not, stop and tell the user to install Node.js LTS.
2. Run `npm -v` and `netlify --version`. If `netlify` is missing, ask permission and run `npm install -g netlify-cli`.
3. List the current folder. It should contain only `BUILD_GUIDE.md` (and maybe `.claude/`). If other files exist, ask before continuing.
4. Create your task list.

### Phase 1. Create the files

1. Create every file in Part 3, rows 1 to 27, from Part 8, plus empty folders `public/assets/img`, `public/assets/pdf` (add a `.gitkeep` file in each).
2. Verify: check that each of the 27 paths exists, and run `node --check` on every `.js` file under `scripts/`, `netlify/` and `public/`. Run `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('public/assets/favicon/site.webmanifest','utf8')); console.log('json ok')"`.

### Phase 2. Install

1. Run `npm install`.
2. Run `npm run check -- --no-db`. It will report missing secrets because `.env` does not exist yet. That is expected; just confirm the script itself runs without crashing.

**CHECKPOINT 1.** Tell the user: files created and syntax-checked; next is the secrets file. Wait for "continue".

### Phase 3. Secrets (`.env`), guided

You create `.env` from `.env.example` (copy it with your file tool, do not read any real values). Then you guide the user one variable at a time. **They** type the values into `.env` in VS Code; you only run `npm run check` and read its output.

1. Run `npm run check:fill-jwt`. This generates `JWT_SECRET` inside `.env` without displaying it.
2. Tell the user to open `.env` in VS Code and fill in the rest, using this table. Present the steps for the variables in order, and after each batch run `npm run check` and read the result.

| Variable | What to put | Where to get it |
|---|---|---|
| `MONGODB_URI` | The Atlas connection string with the real password in place of `<password>` (or `<db_password>`). Do **not** add a database name after the host; the code uses `MONGODB_DB`. If the password has special characters (`@ : / ? # %`), URL-encode them, or create a new database user with a letters-and-numbers password. | Atlas, then Clusters, then Connect, then Drivers |
| `MONGODB_DB` | `portfolio` | fixed |
| `ADMIN_PASSWORD` | A passphrase of 16+ characters, letters, numbers and dashes only (avoid `#`, `$`, quotes and spaces, which some `.env` parsers mishandle). The user chooses it and remembers it; it is how they sign in at `/admin/`. | user's choice |
| `JWT_SECRET` | Already generated in step 1. | automatic |
| `RESEND_API_KEY` | Starts with `re_`. | resend.com, then API Keys |
| `NOTIFY_EMAIL` | **Must be the exact email address the Resend account was created with.** Without a verified sending domain, Resend only delivers to the account owner's own address. | the user's Resend login email |
| `DASHBOARD_TZ` | `Asia/Kolkata` | fixed |

3. Before the database check, remind the user to confirm in Atlas: **Database Access** has a user with read/write access, and **Network Access** allows `0.0.0.0/0` (Netlify functions have no fixed IP address).
4. `npm run check` must end with all variables OK and `OK MongoDB connection`. If it prints a hint, relay the hint and wait. Never ask for the values.

**CHECKPOINT 2.** All checks green. Wait for "continue".

### Phase 4. Local verification

1. Start the server in the background: `npm run dev`. Wait until the output shows it is ready on `http://localhost:8888`. If the Netlify CLI asks you to log in or link a site, decline; this project does not need either. If it hangs, try `netlify dev --offline`.
2. Run `npm run smoke`. Every test must pass. The smoke test creates a few records whose visitor id starts with `test-`.
3. Run `npm run cleanup` to delete those test records.
4. Ask the user to do these manual checks in their own browser, and wait for their report:
   1. Open `http://localhost:8888`. The page should look right in light and dark mode (moon button) and on a narrow window.
   2. Open `http://localhost:8888/?track=1&ref=test`. This records one visit locally (tracking is off on localhost without `?track=1`).
   3. Open `http://localhost:8888/admin/`, sign in with their `ADMIN_PASSWORD`. The dashboard should show 1 new visitor. Open the same address in a new tab of the same private window and refresh the dashboard: Returning visits should increase by 1, New visitors should not.
   4. Submit the contact form once using their **own real email address** as the sender. They should see "Thanks! Your message has been sent.", an email should arrive at `NOTIFY_EMAIL` (check spam), and the message should appear in the dashboard under Messages. They can then delete it from the dashboard.
5. Stop the dev server.

**CHECKPOINT 3.** Wait for the user's report. If any manual check fails, use Part 6 to diagnose.

### Phase 5. Assets and content review

1. Ask the user to copy these files (you cannot create them):

| Put this file | Here |
|---|---|
| Profile photo (square, under 300 KB, PNG) | `public/assets/img/profile.png` |
| Latest CV PDF | `public/assets/pdf/Taranjot-Singh-CV.pdf` |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` from the old project's `public/assets/favicon/` | `public/assets/favicon/` |

2. Walk the user through Part 5 and apply the changes they choose, editing only the places named there.
3. Re-run `node --check` on any JavaScript file you edited and `npm run check`.

### Phase 6. Handoff

Give the user this final report, then stop:

1. What was built (one line).
2. What you verified (list the tests that passed).
3. Anything you noticed that you did not change.
4. The Netlify environment variables they must set (names only; they copy the values from their own `.env`): `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD`, `JWT_SECRET`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, `DASHBOARD_TZ`.
5. A pointer to Part 7 for GitHub and Netlify.

## Part 5. Content to confirm before publishing

The portfolio text comes from the user's four CVs (merged). Ask about each item and change only what they decide.

1. **Public contact details.** The page shows the phone number `(+91) 9205146524` and the Gmail address `taranjot11111@gmail.com`; the CVs list a different institute address, `taranjot.singh25b@gim.ac.in`. Ask which email should be public and whether the phone number should be shown at all. Phone numbers on public pages attract spam.
2. **Location** is shown as "Goa, India". Confirm or change it.
3. **Project links.** The two "View code" buttons point to the GitHub profile `https://github.com/taranjotsingh23`. Replace them with exact repository links if the user has them. The KPMG project card has no link on purpose.
4. **Academic scores** (CGPA and percentages) appear in the Education table. Ask whether to keep or remove them.
5. **Empower figures.** The Experience section shows model metrics from the internship CV. Ask whether the employer is comfortable with them being public.
6. **Drafted text.** The hobby descriptions and the About paragraphs were drafted from the CVs. Offer to edit them.
7. **Tandarust** is described as "2nd Runner-up, National Finalists" at Smart India Hackathon 2022 to match the awards list.
8. **Country in the dashboard** is read on a best-effort basis from a Netlify header and may show "Unknown".

## Part 6. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `netlify: command not found` | `npm install -g netlify-cli`, then reopen the terminal |
| Check says `Server selection timed out` | Atlas Network Access does not allow `0.0.0.0/0`, the cluster is paused (resume it in Atlas), or the connection string host is wrong |
| Check says `bad auth` or `Authentication failed` | Wrong database username or password in `MONGODB_URI`, or special characters in the password that need URL-encoding |
| Check says `ENOTFOUND` or `querySrv` | Typo in the cluster host, or no internet |
| Dashboard login says "Server is not configured" | `ADMIN_PASSWORD` or `JWT_SECRET` is empty. Fix `.env`, then restart `npm run dev` (it reads `.env` only on start) |
| Message saved but "email not sent" tag appears | Resend rejected the send. `403` almost always means `NOTIFY_EMAIL` is not the Resend account's own email; `401` means a wrong or restricted API key |
| Visits are not recorded locally | The tracker is off on localhost. Use `http://localhost:8888/?track=1` |
| Visits are not recorded in production | Do Not Track is on in the browser, or the visit is a bot user-agent, or only one visit per browser session counts |
| `EADDRINUSE` on port 8888 | Another dev server is running; stop it |
| Everything works locally but not on Netlify | The Netlify environment variables are missing, or the site was not redeployed after adding them |

## Part 7. After the build: GitHub and Netlify (the user does this)

**GitHub (new private repository)**

1. On github.com choose New repository, name it `portfolio-platform`, set it to Private, and leave README, .gitignore and license unchecked.
2. In the VS Code terminal run:

```text
git init
git add -A
git status
```

3. Check that `.env` is **not** in the list. Then run:

```text
git commit -m "Initial commit: portfolio platform"
git branch -M main
git remote add origin https://github.com/taranjotsingh23/portfolio-platform.git
git push -u origin main
```

**Netlify (new site)**

1. In Netlify choose Add new project, then Import an existing project, then GitHub, authorize it, and pick `portfolio-platform`.
2. Leave the build command empty. The publish directory is `public` (from `netlify.toml`).
3. Before the first deploy, add the seven environment variables listed in Phase 6, copying the values from your local `.env`. Mark the secrets as secret values.
4. Deploy. If you add or change a variable later, trigger a new deploy.

**Verify the live site**

- Submit the live contact form: the message should reach your inbox and appear in `/admin/`.
- Open the live site in a private window: New visitors goes up by 1. Open it in a new tab of the same window: Returning visits goes up by 1.
- In Atlas, Browse Collections should show `visitors`, `visitevents` and `messages` in the `portfolio` database. To start with clean numbers, delete the test documents in `visitors` and `visitevents`.
- In Netlify, Logs, Functions, the `keep-alive` function should run once a day.
- Put `?ref=linkedin` (or `?ref=resume`) on the portfolio link in your LinkedIn profile and CV; the dashboard's Traffic sources will then show where recruiters came from.
- Delete the old Netlify sites and old repositories once the new one works.

---

# Part 8. Source files

Each block below is one file. Path in the heading, content in the fence.

## Config and project files

### FILE: package.json

```json
{
  "name": "portfolio-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "netlify dev",
    "check": "node scripts/check-setup.js",
    "check:fill-jwt": "node scripts/check-setup.js --fill-jwt",
    "smoke": "node scripts/smoke-test.js",
    "cleanup": "node scripts/cleanup-test-data.js"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "mongoose": "^8.9.0"
  }
}
```

### FILE: netlify.toml

```toml
[build]
  publish = "public"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[functions."keep-alive"]
  schedule = "@daily"

[dev]
  framework = "#static"
  publish = "public"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Frame-Options = "SAMEORIGIN"

[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
    Cache-Control = "no-store"
```

### FILE: .gitignore

```text
node_modules/
.netlify
.env
.env.*
!.env.example
logs/
*.log
.vscode/
.DS_Store
Thumbs.db
```

### FILE: .env.example

```text
# Copy this file to .env and fill in the values. Never commit .env.

# Atlas connection string. Replace the password placeholder. Do not add a database name to the path.
MONGODB_URI=
MONGODB_DB=portfolio

# Passphrase you use to sign in at /admin/ (16+ characters; letters, numbers and dashes only)
ADMIN_PASSWORD=

# Random secret used to sign admin tokens (generated for you by: npm run check:fill-jwt)
JWT_SECRET=

# Resend API key (starts with re_) and the email address that owns the Resend account
RESEND_API_KEY=
NOTIFY_EMAIL=

DASHBOARD_TZ=Asia/Kolkata
```

### FILE: README.md

```markdown
# Portfolio Platform

A recruiter-facing portfolio at `/` and a password-protected analytics dashboard at `/admin/`, built on Netlify (static site plus Functions) with MongoDB Atlas and Resend.

## Run locally

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in
3. `npm run check` validates `.env` and the MongoDB connection and never prints secrets
4. `npm run dev`, then open http://localhost:8888 (dashboard at /admin/)
5. `npm run smoke` runs automated checks against the local server; `npm run cleanup` removes the test visitors it created

Tracking is off on localhost. Add `?track=1` to the URL to record a local visit.

## Deploy

Push to `main`. In Netlify set MONGODB_URI, MONGODB_DB, ADMIN_PASSWORD, JWT_SECRET, RESEND_API_KEY, NOTIFY_EMAIL and DASHBOARD_TZ, then redeploy.

## Data model (database `portfolio`)

- `visitors`: one document per unique visitor (first and last visit, number of sessions, device, browser, OS, country, source)
- `visitevents`: one document per session, flagged `isNewVisitor` (true only on the visitor's first ever session)
- `messages`: contact form submissions with a status (new, read, archived) and email delivery result
```

### FILE: scripts/_env.js

```js
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
```

### FILE: scripts/check-setup.js

```js
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
```

### FILE: scripts/smoke-test.js

```js
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
```

### FILE: scripts/cleanup-test-data.js

```js
/* Deletes the test visitors created by the smoke test (visitor ids starting with "test-"). Usage: npm run cleanup */
require('./_env').applyEnv();
const mongoose = require('mongoose');
const { connect, getModels } = require('../netlify/lib/db');

(async () => {
  await connect();
  const { Visitor, VisitEvent } = getModels();
  const visitors = await Visitor.deleteMany({ visitorId: /^test-/ });
  const events = await VisitEvent.deleteMany({ visitorId: /^test-/ });
  console.log('Removed ' + visitors.deletedCount + ' test visitors and ' + events.deletedCount + ' test visit events.');
  await mongoose.disconnect();
})().catch((e) => {
  console.error('Cleanup failed: ' + (e && e.name ? e.name : 'Error') + '. Run npm run check to diagnose the connection.');
  process.exit(1);
});
```

## Backend: shared library

### FILE: netlify/lib/db.js

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', true);

/* ---------- Schemas ---------- */

// One document per unique visitor
const visitorSchema = new Schema(
  {
    visitorId: { type: String, required: true, unique: true },
    firstVisit: { type: Date, required: true },
    lastVisit: { type: Date, required: true },
    visitCount: { type: Number, default: 0 }, // number of sessions
    firstSource: String,
    lastSource: String,
    device: String,
    browser: String,
    os: String,
    country: String,
    userAgent: String,
    lastPath: String,
  },
  { timestamps: true }
);
visitorSchema.index({ lastVisit: -1 });

// One document per session (visit)
const visitEventSchema = new Schema({
  visitorId: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  isNewVisitor: { type: Boolean, required: true }, // true = first-ever visit of this visitor
  path: String,
  source: String, // ?ref= value, referrer host, or "direct"
  referrerHost: String,
  device: String,
  browser: String,
  os: String,
  country: String,
});

// Contact form submissions
const messageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, maxlength: 120 },
    subject: { type: String, maxlength: 120, default: '' },
    message: { type: String, required: true, maxlength: 3000 },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new', index: true },
    emailSent: { type: Boolean, default: false },
    emailError: { type: String, default: null },
    ipHash: { type: String, index: true },
  },
  { timestamps: true }
);
messageSchema.index({ createdAt: -1 });

function getModels() {
  return {
    Visitor: mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema),
    VisitEvent: mongoose.models.VisitEvent || mongoose.model('VisitEvent', visitEventSchema),
    Message: mongoose.models.Message || mongoose.model('Message', messageSchema),
  };
}

/* ---------- Connection (reused across warm invocations) ---------- */

const cache = global._pfCache || (global._pfCache = { promise: null, ready: false });

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (mongoose.connection.readyState === 1 && cache.ready) return mongoose;

  if (!cache.promise || mongoose.connection.readyState === 0) {
    cache.ready = false;
    cache.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || 'portfolio',
        serverSelectionTimeoutMS: 5000, // fail fast if the cluster is paused or unreachable
        socketTimeoutMS: 20000,
        maxPoolSize: 5,
      })
      .then(async () => {
        const m = getModels();
        await Promise.all([m.Visitor.init(), m.VisitEvent.init(), m.Message.init()]); // create indexes
        cache.ready = true;
      })
      .catch((err) => {
        cache.promise = null;
        throw err;
      });
  }
  await cache.promise;
  return mongoose;
}

module.exports = { connect, getModels };
```

### FILE: netlify/lib/http.js

```js
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
```

### FILE: netlify/lib/auth.js

```js
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
```

## Backend: functions

### FILE: netlify/functions/track.js

```js
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
```

### FILE: netlify/functions/contact.js

```js
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
```

### FILE: netlify/functions/admin-login.js

```js
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
```

### FILE: netlify/functions/admin-stats.js

```js
const { connect, getModels } = require('../lib/db');
const { json } = require('../lib/http');
const { isAdmin } = require('../lib/auth');

const TZ = process.env.DASHBOARD_TZ || 'Asia/Kolkata';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { ok: false, error: 'Method Not Allowed' });
  if (!isAdmin(event)) return json(401, { ok: false, error: 'unauthorized' });

  const days = Math.min(Math.max(parseInt((event.queryStringParameters || {}).days, 10) || 30, 1), 3650);
  const match = { timestamp: { $gte: new Date(Date.now() - days * 86400000) } };

  try {
    await connect();
    const { Visitor, VisitEvent, Message } = getModels();

    const top = (field, n = 8) =>
      VisitEvent.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ['$' + field, 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: n },
      ]);

    const [byType, uniq, daily, sources, devices, browsers, countries, lifetime, cameBack, recent, msgTotal, msgNew] =
      await Promise.all([
        VisitEvent.aggregate([{ $match: match }, { $group: { _id: '$isNewVisitor', count: { $sum: 1 } } }]),
        VisitEvent.aggregate([{ $match: match }, { $group: { _id: '$visitorId' } }, { $count: 'n' }]),
        VisitEvent.aggregate([
          { $match: match },
          { $group: { _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: TZ } }, n: '$isNewVisitor' }, count: { $sum: 1 } } },
        ]),
        top('source'), top('device'), top('browser'), top('country'),
        Visitor.countDocuments(),
        Visitor.countDocuments({ visitCount: { $gt: 1 } }),
        Visitor.find().sort({ lastVisit: -1 }).limit(15)
          .select('visitorId firstVisit lastVisit visitCount device browser os country lastSource').lean(),
        Message.countDocuments(),
        Message.countDocuments({ status: 'new' }),
      ]);

    let newV = 0;
    let ret = 0;
    byType.forEach((r) => (r._id ? (newV = r.count) : (ret = r.count)));

    // Daily series with gaps filled in
    const map = {};
    daily.forEach((r) => {
      const d = r._id.d;
      map[d] = map[d] || { date: d, newVisitors: 0, returning: 0 };
      if (r._id.n) map[d].newVisitors = r.count; else map[d].returning = r.count;
    });
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
    const keys = Object.keys(map).sort();
    const series = [];
    if (keys.length) {
      for (let t = Date.parse(keys[0] + 'T00:00:00Z'), end = Date.parse(todayStr + 'T00:00:00Z'); t <= end; t += 86400000) {
        const d = new Date(t).toISOString().slice(0, 10);
        series.push(map[d] || { date: d, newVisitors: 0, returning: 0 });
      }
    }
    const today = map[todayStr] ? map[todayStr].newVisitors + map[todayStr].returning : 0;
    const rows = (a) => a.map((r) => ({ name: r._id, count: r.count }));

    return json(200, {
      ok: true,
      days,
      kpis: {
        totalVisits: newV + ret,
        uniqueVisitors: uniq[0] ? uniq[0].n : 0,
        newVisitors: newV,
        returningVisits: ret,
        today,
        allTimeVisitors: lifetime,
        cameBackAllTime: cameBack,
        messagesTotal: msgTotal,
        messagesUnread: msgNew,
      },
      daily: series,
      sources: rows(sources),
      devices: rows(devices),
      browsers: rows(browsers),
      countries: rows(countries),
      recent: recent.map((v) => ({ ...v, visitorId: v.visitorId.slice(0, 8), _id: undefined })),
    });
  } catch (err) {
    console.error('admin-stats error:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
};
```

### FILE: netlify/functions/admin-messages.js

```js
const mongoose = require('mongoose');
const { connect, getModels } = require('../lib/db');
const { json } = require('../lib/http');
const { isAdmin } = require('../lib/auth');

const STATUSES = ['new', 'read', 'archived'];

exports.handler = async (event) => {
  if (!isAdmin(event)) return json(401, { ok: false, error: 'unauthorized' });
  const qs = event.queryStringParameters || {};

  try {
    await connect();
    const { Message } = getModels();

    if (event.httpMethod === 'GET') {
      const filter = STATUSES.includes(qs.status) ? { status: qs.status } : {};
      const items = await Message.find(filter).sort({ createdAt: -1 }).limit(100).select('-ipHash -__v').lean();
      return json(200, { ok: true, items });
    }

    if (event.httpMethod === 'PATCH') {
      const b = JSON.parse(event.body || '{}');
      if (!mongoose.isValidObjectId(b.id) || !STATUSES.includes(b.status)) return json(400, { ok: false, error: 'Invalid input' });
      await Message.updateOne({ _id: b.id }, { $set: { status: b.status } });
      return json(200, { ok: true });
    }

    if (event.httpMethod === 'DELETE') {
      if (!mongoose.isValidObjectId(qs.id)) return json(400, { ok: false, error: 'Invalid id' });
      await Message.deleteOne({ _id: qs.id });
      return json(200, { ok: true });
    }

    return json(405, { ok: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('admin-messages error:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
};
```

### FILE: netlify/functions/keep-alive.js

```js
const mongoose = require('mongoose');
const { connect } = require('../lib/db');

exports.handler = async () => {
  try {
    await connect();
    await mongoose.connection.db.command({ ping: 1 });
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('keep-alive failed:', err);
    return { statusCode: 500, body: 'fail' };
  }
};
```

## Frontend: portfolio website

### FILE: public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Taranjot Singh | Data Analytics &amp; Machine Learning</title>
  <meta name="description" content="Portfolio of Taranjot Singh, PGDM (Big Data Analytics) candidate at Goa Institute of Management. Machine learning, analytics, projects, experience and achievements.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Taranjot Singh | Data Analytics &amp; Machine Learning">
  <meta property="og:description" content="PGDM (Big Data Analytics) candidate at GIM, Goa. Machine learning, analytics and business insight.">
  <link rel="icon" href="assets/favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon/favicon-32x32.png">
  <link rel="apple-touch-icon" href="assets/favicon/apple-touch-icon.png">
  <link rel="manifest" href="assets/favicon/site.webmanifest">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
<header>
  <div class="container bar">
    <a href="#home" class="logo">Taranjot Singh</a>
    <nav id="nav">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#achievements">Achievements</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <div class="tools">
      <button class="icon-btn" id="themeBtn" aria-label="Toggle theme">&#9680;</button>
      <button class="icon-btn" id="menuBtn" aria-label="Menu">&#9776;</button>
    </div>
  </div>
</header>

<main>
  <!-- HOME -->
  <section id="home" class="container">
    <div class="hero">
      <div>
        <h1>Hi, I'm <span>Taranjot Singh</span></h1>
        <div class="role">Data Analytics &amp; Machine Learning</div>
        <p>PGDM candidate in Big Data Analytics at Goa Institute of Management. I turn messy data into machine-learning models and clear business insight, and I'm looking for data science and analytics roles.</p>
        <div class="actions">
          <a href="#contact" class="btn btn-primary">Contact me</a>
          <a href="assets/pdf/Taranjot-Singh-CV.pdf" download class="btn btn-ghost">Download CV</a>
        </div>
        <div class="socials">
          <a href="https://www.linkedin.com/in/taranjot--singh" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/taranjotsingh23" target="_blank" rel="noopener">GitHub</a>
          <a href="mailto:taranjot11111@gmail.com">Email</a>
        </div>
      </div>
      <img class="photo" src="assets/img/profile.png" alt="Portrait of Taranjot Singh">
    </div>
    <div class="stats">
      <div class="card stat"><b>3</b>Internships</div>
      <div class="card stat"><b>3</b>Projects</div>
      <div class="card stat"><b>14K+</b>Students impacted</div>
      <div class="card stat"><b>16K+</b>LinkedIn followers</div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="container">
    <h2 class="title">About Me</h2>
    <p class="sub">My introduction</p>
    <div class="card">
      <p>I'm a PGDM (Big Data Analytics) student at Goa Institute of Management with a B.Tech in Computer Science and Engineering. I work across the data lifecycle: SQL and Python for data curation, feature engineering, machine learning, and turning results into decisions for business teams.</p>
      <br>
      <p>Beyond coursework, I founded the Hack Unicorn Club, evaluate ideas at Smart India Hackathon, and share what I learn with a 16,000+ LinkedIn audience.</p>
    </div>
  </section>

  <!-- EXPERIENCE -->
  <section id="experience" class="container">
    <h2 class="title">Experience</h2>
    <p class="sub">Internships and industry work</p>
    <div class="stack">
      <article class="card item">
        <h3>Marketing Analytics Intern (Data Science)</h3>
        <div class="meta">Empower GBS India Pvt. Ltd., Bengaluru (onsite) &middot; Apr 2026 &ndash; Aug 2026</div>
        <ul>
          <li>Consolidated 1.1M+ raw records from 3 sources into a model-ready population of 495,595 plans, using SQL on Amazon Redshift (DBeaver) and SAS Viya with a 9-stage data-cleaning pipeline.</li>
          <li>Grew the feature space from 45 raw variables to 80 features, engineering 7 ratio-based and 3 interaction-based features in Python.</li>
          <li>Built a class-weighted Random Forest with 98.3% precision, 59.5% recall and 74% F1 on out-of-sample data; benchmarked 25 model-strategy combinations and tuned with RandomizedSearchCV.</li>
          <li>Outperformed the existing rule-based scoring approach by more than 13x, cutting wasted sales outreach by nearly 64% while keeping 79.8% of conversions captured on real-time opportunity data.</li>
        </ul>
      </article>
      <article class="card item">
        <h3>Senior Management Associate Intern</h3>
        <div class="meta">Metvy Net Pvt. Ltd. &middot; Mar 2025 &ndash; Jun 2025</div>
        <ul>
          <li>Managed learning cohorts of 100+ learners from diverse backgrounds in Consultancy and Data Analytics programs.</li>
          <li>Moderated cohort workshops and live sessions, coordinated with mentors, and collected periodic learner feedback.</li>
          <li>Implemented SOPs including a Management Tracker and Performance Evaluator to monitor learner progress.</li>
          <li>Achieved 91.47% program completion, 143.74% skill rating improvement and a 26.82% rise in task completion rate.</li>
        </ul>
      </article>
      <article class="card item">
        <h3>Content Designing Intern</h3>
        <div class="meta">To-Let Globe &middot; May 2024 &ndash; Jul 2024</div>
        <ul>
          <li>Organized daily content review stand-ups to track progress and keep to deadlines.</li>
          <li>Designed graphics for Instagram, LinkedIn, Threads, X and the website, boosting followers by 37.20%.</li>
          <li>Built a portfolio of 60+ engagement-driven creatives, expanding the content bank by 35%.</li>
          <li>Increased interaction rate by 41.79% across online and offline divisions, contributing to 15.5% revenue growth.</li>
        </ul>
      </article>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="projects" class="container">
    <h2 class="title">Projects</h2>
    <p class="sub">Selected work</p>
    <div class="grid">
      <article class="card item">
        <h3>Bank Customer Churn Prediction</h3>
        <div class="meta">2025 &middot; End-to-end ML pipeline</div>
        <p>Predicts churn for 10,000 European bank customers using EDA, feature transformation, SMOTE and RFECV. LightGBM reached 92% accuracy and 76% recall, with Credit Score and Banking Products as key drivers.</p>
        <p style="margin:12px 0"><span class="chip">Python</span><span class="chip">LightGBM</span><span class="chip">SMOTE</span><span class="chip">RFECV</span></p>
        <a class="btn btn-ghost" href="https://github.com/taranjotsingh23" target="_blank" rel="noopener">View code</a>
      </article>
      <article class="card item">
        <h3>Tandarust</h3>
        <div class="meta">Smart India Hackathon 2022 &middot; 2nd Runner-up, National Finalists</div>
        <p>Android fitness app recommending gym, yoga and cardio plans tailored to lifestyle and schedule. Random Forest on 12,000+ exercises (97.4% accuracy), 3D exercise models in Blender, voice guidance with Google Cloud Text-to-Speech and Alan AI voice navigation.</p>
        <p style="margin:12px 0"><span class="chip">Random Forest</span><span class="chip">Android</span><span class="chip">Blender</span><span class="chip">Alan AI</span></p>
        <a class="btn btn-ghost" href="https://github.com/taranjotsingh23" target="_blank" rel="noopener">View code</a>
      </article>
      <article class="card item">
        <h3>Behavioural Insights Engine</h3>
        <div class="meta">2026 &middot; KPMG industry live project</div>
        <p>Industry live project with KPMG applying NLP-based sentiment analysis and topic modeling.</p>
        <p style="margin:12px 0"><span class="chip">NLP</span><span class="chip">Sentiment analysis</span><span class="chip">Topic modeling</span></p>
      </article>
    </div>
  </section>

  <!-- SKILLS -->
  <section id="skills" class="container">
    <h2 class="title">Skills</h2>
    <p class="sub">Technical toolkit</p>
    <div class="grid">
      <div class="card"><h3>Programming</h3><br><span class="chip">Python</span><span class="chip">SQL</span><span class="chip">R</span><span class="chip">Pandas</span><span class="chip">NumPy</span><span class="chip">Scikit-learn</span></div>
      <div class="card"><h3>Machine Learning</h3><br><span class="chip">Random Forest</span><span class="chip">LightGBM</span><span class="chip">SMOTE</span><span class="chip">Feature engineering</span><span class="chip">RFECV</span><span class="chip">RandomizedSearchCV</span><span class="chip">NLP</span></div>
      <div class="card"><h3>Analytics &amp; BI</h3><br><span class="chip">Power BI</span><span class="chip">Tableau</span><span class="chip">MS Excel</span><span class="chip">SAS Viya</span><span class="chip">EDA</span></div>
      <div class="card"><h3>Cloud &amp; Databases</h3><br><span class="chip">Amazon Redshift</span><span class="chip">DBeaver</span><span class="chip">AWS S3</span><span class="chip">MongoDB</span><span class="chip">Firebase</span></div>
      <div class="card"><h3>Web &amp; Dev Tools</h3><br><span class="chip">HTML</span><span class="chip">CSS</span><span class="chip">JavaScript</span><span class="chip">Node.js</span><span class="chip">Express.js</span><span class="chip">Git</span><span class="chip">Postman</span></div>
      <div class="card"><h3>AI &amp; Productivity</h3><br><span class="chip">Generative AI</span><span class="chip">Prompt engineering</span><span class="chip">Microsoft Copilot</span><span class="chip">Alan AI</span><span class="chip">Jupyter</span><span class="chip">Canva</span><span class="chip">PowerPoint</span></div>
    </div>
  </section>

  <!-- EDUCATION -->
  <section id="education" class="container">
    <h2 class="title">Education</h2>
    <p class="sub">Academic record</p>
    <div class="card" style="overflow-x:auto">
      <table class="table">
        <tr><th>Programme</th><th>Years</th><th>Institution</th><th>Score</th></tr>
        <tr><td>PGDM - Big Data Analytics</td><td>2025 - 27</td><td>Goa Institute of Management, Goa</td><td>5.78 / 8 CGPA</td></tr>
        <tr><td>B.Tech, Computer Science and Engineering</td><td>2019 - 23</td><td>Guru Tegh Bahadur Institute of Technology</td><td>92.70% (Dean's Merit List)</td></tr>
        <tr><td>HSC - Science</td><td>2017 - 19</td><td>Mamta Modern Senior Secondary School (CBSE)</td><td>91.17% (Top 10 in school)</td></tr>
        <tr><td>SSC - General</td><td>2016 - 17</td><td>Mamta Modern Senior Secondary School (CBSE)</td><td>8.8 / 10 CGPA</td></tr>
      </table>
    </div>
  </section>

  <!-- ACHIEVEMENTS -->
  <section id="achievements" class="container">
    <h2 class="title">Achievements</h2>
    <p class="sub">Awards, certifications and leadership</p>
    <div class="grid">
      <div class="card">
        <h3>Awards</h3>
        <ul class="list">
          <li><span class="tag">2026</span> 1st Prize, PitchTank 5.0 (HoloCarte)<small>National Level Business Idea Pitching Competition, E-Cell GIM</small></li>
          <li><span class="tag">2026</span> Top 5, Bitathon<small>National-level data science and analytics hackathon by SAS, 150+ teams</small></li>
          <li><span class="tag">2025</span> INR 5 lakh Academic Competence and Excellence Scholarship<small>Goa Institute of Management, Achiever's Round</small></li>
          <li><span class="tag">2025</span> Student representative, AACSB and AMBA-BGA accreditation panels<small>Official member for the GIM student body</small></li>
          <li><span class="tag">2023</span> 3rd Prize, Vihaan 6.0 Hackathon<small>Mental health website with live community support and music therapy modules</small></li>
          <li><span class="tag">2022</span> 2nd Runner-up, Smart India Hackathon<small>Ministry of Education and AICTE, National Finalists, prize worth INR 1 lakh</small></li>
          <li><span class="tag">2019</span> Mamta Shree Award<small>Excellence in academics and co-curricular activities, Class XII</small></li>
        </ul>
      </div>
      <div class="card">
        <h3>Certifications</h3>
        <ul class="list">
          <li><span class="tag">2026</span> Corporate Finance and FP&amp;A<small>InsideIIM</small></li>
          <li><span class="tag">2025</span> Lean Six Sigma Green Belt<small>Grant Thornton Bharat</small></li>
          <li><span class="tag">2025</span> Financial Markets and Investment Banking<small>Finlatics, 2-month Experience Program</small></li>
          <li><span class="tag">2025</span> Corporate Financial Statement Analysis<small>LinkedIn Learning</small></li>
          <li><span class="tag">2024</span> Business Consultancy Cohort<small>Metvy Net Pvt. Ltd., 3 months</small></li>
          <li><span class="tag">2023</span> Advanced Entrepreneurship cum Skill Development Programme (E-SDP)<small>IIT Kanpur Outreach Center</small></li>
        </ul>
      </div>
      <div class="card">
        <h3>Leadership &amp; Volunteering</h3>
        <ul class="list">
          <li><span class="tag">2023 - 25</span> Founder, Hack Unicorn Club<small>22 hackathons, 18 tech meetups, 16 mentor sessions, 14,000+ students impacted</small></li>
          <li><span class="tag">2025 - 26</span> Junior Placement Coordinator<small>Corporate Relations and Placement Cell, GIM</small></li>
          <li><span class="tag">2022 - 23</span> Content Team Lead, GDSC-GTBIT<small>Led a 13-member team; digital content, graphics and website UI/UX</small></li>
          <li><span class="tag">2023 - 24</span> Mentor and Idea Evaluator, Smart India Hackathon<small>Evaluated 1,700+ ideas across 254 problem statements</small></li>
          <li><span class="tag">2022 - 26</span> LinkedIn Content Creator<small>16,000+ followers, 400,000+ post impressions</small></li>
          <li><span class="tag">2024</span> Volunteer, Inamigos Foundation<small>Fundraising for Project Seva (food and clothing for communities in Delhi)</small></li>
        </ul>
      </div>
    </div>
  </section>

  <!-- HOBBIES -->
  <section id="hobbies" class="container">
    <h2 class="title">Hobbies</h2>
    <p class="sub">What I like to do in my free time</p>
    <div class="grid">
      <div class="card hobby"><div class="emoji">&#128218;</div><h3>Startups &amp; Business</h3><p class="muted">Reading about startups, founders and how businesses grow.</p></div>
      <div class="card hobby"><div class="emoji">&#127951;</div><h3>Cricket</h3><p class="muted">Watching matches and following the strategy behind them.</p></div>
      <div class="card hobby"><div class="emoji">&#9823;&#65039;</div><h3>Chess</h3><p class="muted">Planning ahead and weighing trade-offs, one move at a time.</p></div>
      <div class="card hobby"><div class="emoji">&#127911;</div><h3>Punjabi Music</h3><p class="muted">Listening to Punjabi tracks, old and new.</p></div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="container">
    <h2 class="title">Get in Touch</h2>
    <p class="sub">Open to data science and analytics opportunities</p>
    <div class="contact">
      <div class="card">
        <ul class="info">
          <li><b>Email</b><br><a href="mailto:taranjot11111@gmail.com">taranjot11111@gmail.com</a></li>
          <li><b>Phone</b><br><a href="tel:+919205146524">(+91) 9205146524</a></li>
          <li><b>Location</b><br>Goa, India</li>
          <li><b>LinkedIn</b><br><a href="https://www.linkedin.com/in/taranjot--singh" target="_blank" rel="noopener">linkedin.com/in/taranjot--singh</a></li>
        </ul>
      </div>
      <form class="card" id="contactForm" novalidate>
        <label for="name">Full name</label>
        <input id="name" name="name" type="text" maxlength="80" required placeholder="Your name">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" maxlength="120" required placeholder="you@company.com">
        <label for="subject">Subject</label>
        <input id="subject" name="subject" type="text" maxlength="120" placeholder="Role or opportunity">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="6" maxlength="3000" required placeholder="Hi Taranjot, ..."></textarea>
        <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-primary" type="submit">Send message</button>
        <div class="status" id="formStatus" role="status" aria-live="polite"></div>
      </form>
    </div>
  </section>
</main>

<footer>
  <div class="container">
    &copy; <span id="year"></span> Taranjot Singh. All rights reserved.<br>
    This site uses a first-party identifier to count visits.
  </div>
</footer>

<script src="js/tracker.js"></script>
<script src="js/main.js"></script>
</body>
</html>
```

### FILE: public/css/styles.css

```css
:root{--bg:#f6f7fb;--card:#fff;--text:#1d2233;--muted:#667085;--primary:#5b5bd6;--ink:#fff;--border:#e3e6ef;--shadow:0 6px 24px rgba(29,34,51,.08)}
[data-theme=dark]{--bg:#0e1120;--card:#171b2e;--text:#e8ebf6;--muted:#9aa3bd;--primary:#8b8bff;--ink:#0e1120;--border:#262b46;--shadow:0 6px 24px rgba(0,0,0,.4)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:76px}
body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.65}
a{color:inherit;text-decoration:none}
ul{list-style:none}
img{max-width:100%;display:block}
.container{width:min(1100px,92%);margin-inline:auto}
section{padding:76px 0}
.title{font-size:1.9rem;line-height:1.2}
.sub{color:var(--muted);margin:6px 0 32px}
.muted{color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:10px;font:inherit;font-weight:600;border:1px solid transparent;cursor:pointer}
.btn-primary{background:var(--primary);color:var(--ink)}
.btn-ghost{background:var(--card);border-color:var(--border)}
.btn:disabled{opacity:.6;cursor:wait}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--shadow)}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.chip{display:inline-block;padding:4px 12px;margin:0 6px 8px 0;border-radius:999px;background:var(--bg);border:1px solid var(--border);font-size:.85rem}

/* Header */
header{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.bar{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:700;font-size:1.1rem}
nav ul{display:flex;gap:6px}
nav a{padding:8px 12px;border-radius:8px;color:var(--muted);font-weight:500}
nav a:hover,nav a.active{color:var(--text);background:var(--card)}
.tools{display:flex;gap:8px;align-items:center}
.icon-btn{width:40px;height:40px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);cursor:pointer;font-size:1.1rem}
#menuBtn{display:none}

/* Hero */
.hero{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:center;padding-top:70px}
.hero h1{font-size:clamp(2.2rem,5vw,3.4rem);line-height:1.1;margin-bottom:10px}
.hero h1 span{color:var(--primary)}
.role{font-size:1.25rem;font-weight:600;margin-bottom:14px}
.hero p{color:var(--muted);max-width:56ch;margin-bottom:24px}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.socials{display:flex;gap:16px;color:var(--muted);font-weight:500}
.socials a:hover{color:var(--primary)}
.photo{width:min(320px,80%);aspect-ratio:1;margin-inline:auto;border-radius:50%;object-fit:cover;border:6px solid var(--card);box-shadow:var(--shadow)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-top:48px}
.stat{text-align:center}
.stat b{display:block;font-size:1.8rem;color:var(--primary)}

/* Timeline / lists */
.item h3{font-size:1.1rem}
.item .meta{color:var(--muted);font-size:.9rem;margin-bottom:10px}
.item ul{list-style:disc;padding-left:18px}
.item li{margin-bottom:6px}
.stack{display:grid;gap:20px}
.table{width:100%;border-collapse:collapse}
.table td,.table th{text-align:left;padding:12px 10px;border-bottom:1px solid var(--border);vertical-align:top}
.table th{color:var(--muted);font-weight:600;font-size:.85rem}
.list li{padding:10px 0;border-bottom:1px solid var(--border)}
.list li:last-child{border:0}
.list small{display:block;color:var(--muted)}
.tag{font-size:.78rem;color:var(--primary);font-weight:600}
.hobby{text-align:center}
.hobby .emoji{font-size:2.2rem}

/* Contact */
.contact{display:grid;grid-template-columns:1fr 1.3fr;gap:24px}
.info li{margin-bottom:14px}
label{display:block;font-weight:600;font-size:.9rem;margin-bottom:6px}
input,textarea{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font:inherit;margin-bottom:14px}
input:focus,textarea:focus{outline:2px solid var(--primary);border-color:transparent}
.hp{position:absolute;left:-9999px;opacity:0;height:0}
.status{min-height:24px;margin-top:12px;font-weight:500}
.status.ok{color:#16a34a}
.status.err{color:#dc2626}
footer{padding:28px 0;border-top:1px solid var(--border);color:var(--muted);text-align:center;font-size:.9rem}

@media(max-width:820px){
  .hero,.contact{grid-template-columns:1fr}
  .photo{order:-1;width:min(240px,70%)}
  #menuBtn{display:inline-block}
  nav{position:absolute;top:64px;left:0;right:0;background:var(--bg);border-bottom:1px solid var(--border);display:none}
  nav.open{display:block}
  nav ul{flex-direction:column;padding:10px 4%}
}
```

### FILE: public/js/tracker.js

```js
(function () {
  'use strict';

  var VID_KEY = 'pf_visitor_id';
  var SESSION_KEY = 'pf_session';
  var ENDPOINT = '/.netlify/functions/track';

  // Skip when Do Not Track is on, and on localhost (add ?track=1 to test locally)
  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  var isLocal = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
  if (dnt || (isLocal && !/[?&]track=1/.test(location.search))) return;

  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'vid-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
  }

  function getVisitorId() {
    try {
      var id = localStorage.getItem(VID_KEY);
      if (!id) { id = makeId(); localStorage.setItem(VID_KEY, id); }
      return id;
    } catch (e) { return null; }
  }

  function run() {
    try { if (sessionStorage.getItem(SESSION_KEY)) return; sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}

    var id = getVisitorId();
    if (!id) return;

    var q = new URLSearchParams(location.search);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: id,
        path: location.pathname,
        referrer: document.referrer || null,
        ref: q.get('ref') || q.get('utm_source') || null,
      }),
      keepalive: true,
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
```

### FILE: public/js/main.js

```js
(function () {
  'use strict';
  var root = document.documentElement;

  /* Theme */
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  var nav = document.getElementById('nav');
  document.getElementById('menuBtn').addEventListener('click', function () { nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  /* Active link while scrolling */
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && links[en.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        links[en.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Contact form */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var started = Date.now();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    statusEl.className = 'status';
    statusEl.textContent = 'Sending...';

    var data = Object.fromEntries(new FormData(form).entries());
    data.elapsed = Date.now() - started;

    try {
      var res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      var out = await res.json().catch(function () { return {}; });
      if (!res.ok || out.ok === false) throw new Error(out.error || 'Could not send. Please email me directly.');
      form.reset();
      statusEl.className = 'status ok';
      statusEl.textContent = 'Thanks! Your message has been sent.';
    } catch (err) {
      statusEl.className = 'status err';
      statusEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
})();
```

### FILE: public/robots.txt

```text
User-agent: *
Disallow: /admin/
```

### FILE: public/assets/favicon/site.webmanifest

```json
{
  "name": "Taranjot Singh Portfolio",
  "short_name": "Taranjot",
  "icons": [
    { "src": "/assets/favicon/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/favicon/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

## Frontend: admin dashboard

### FILE: public/admin/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin | Portfolio Analytics</title>
  <link rel="stylesheet" href="admin.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
</head>
<body>
  <section id="login" class="login">
    <form id="loginForm" class="card">
      <h1>Admin login</h1>
      <input id="password" type="password" placeholder="Password" autocomplete="current-password" required>
      <button class="btn" type="submit">Sign in</button>
      <p id="loginError" class="err"></p>
    </form>
  </section>

  <div id="app" hidden>
    <header class="top">
      <h1>Portfolio Analytics</h1>
      <div class="controls">
        <select id="range">
          <option value="7">Last 7 days</option>
          <option value="30" selected>Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
          <option value="3650">All time</option>
        </select>
        <button class="btn" id="refresh">Refresh</button>
        <button class="btn ghost" id="logout">Log out</button>
      </div>
    </header>

    <main>
      <p id="error" class="err"></p>
      <div class="kpis" id="kpis"></div>

      <div class="two">
        <div class="card"><h2>Visits per day</h2><canvas id="lineChart"></canvas></div>
        <div class="card"><h2>New vs returning</h2><canvas id="donut"></canvas></div>
      </div>

      <div class="four">
        <div class="card"><h2>Traffic sources</h2><div id="sources"></div></div>
        <div class="card"><h2>Devices</h2><div id="devices"></div></div>
        <div class="card"><h2>Browsers</h2><div id="browsers"></div></div>
        <div class="card"><h2>Countries</h2><div id="countries"></div></div>
      </div>

      <div class="card"><h2>Recent visitors</h2><div class="scroll" id="recent"></div></div>

      <div class="card">
        <div class="row">
          <h2>Messages <span class="badge" id="badge"></span></h2>
          <select id="msgFilter">
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div id="messages"></div>
      </div>
    </main>
  </div>
  <script src="admin.js"></script>
</body>
</html>
```

### FILE: public/admin/admin.css

```css
[hidden]{display:none!important}
:root{--bg:#0f1220;--card:#171b2e;--text:#e8ebf6;--muted:#9aa3bd;--primary:#8b8bff;--border:#262b46;--ok:#22c55e;--err:#f87171}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
h1{font-size:1.3rem}
h2{font-size:1rem;margin-bottom:12px}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:16px}
.btn{padding:9px 16px;border-radius:9px;border:0;background:var(--primary);color:#0f1220;font:inherit;font-weight:600;cursor:pointer}
.btn.ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn.small{padding:5px 10px;font-size:.8rem}
a.btn{display:inline-block;text-decoration:none}
input,select{padding:10px 12px;border-radius:9px;border:1px solid var(--border);background:var(--bg);color:var(--text);font:inherit}
.err{color:var(--err);min-height:20px}
.muted{color:var(--muted)}
.login{min-height:100vh;display:grid;place-items:center;padding:16px}
.login .card{width:min(360px,100%);display:grid;gap:12px}
.top{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;padding:16px 4%;border-bottom:1px solid var(--border)}
.controls{display:flex;flex-wrap:wrap;gap:8px}
main{width:min(1200px,94%);margin:20px auto}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:16px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
.kpi b{display:block;font-size:1.8rem}
.kpi span{color:var(--muted);font-size:.85rem}
.two{display:grid;grid-template-columns:2fr 1fr;gap:16px}
.four{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.rowline{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:.92rem}
.rowline:last-child{border:0}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.88rem}
th,td{text-align:left;padding:9px 8px;border-bottom:1px solid var(--border);white-space:nowrap}
th{color:var(--muted);font-weight:600}
.row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.badge{background:var(--primary);color:#0f1220;border-radius:999px;padding:1px 9px;font-size:.78rem}
.msg{border:1px solid var(--border);border-radius:12px;padding:14px;margin-top:12px}
.msg.new{border-color:var(--primary)}
.msg .meta{color:var(--muted);font-size:.82rem;margin-bottom:8px}
.msg p{white-space:pre-wrap;word-break:break-word;margin-bottom:10px}
.msg .actions{display:flex;flex-wrap:wrap;gap:8px}
.tag{font-size:.75rem;padding:1px 8px;border-radius:999px;border:1px solid var(--border);color:var(--muted)}
@media(max-width:820px){.two{grid-template-columns:1fr}}
```

### FILE: public/admin/admin.js

```js
(function () {
  'use strict';
  var API = '/.netlify/functions/';
  var $ = function (s) { return document.querySelector(s); };
  var token = sessionStorage.getItem('admin_token');
  var charts = {};

  // Always escape stored data before putting it into the page
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(d) { return d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'; }

  async function api(path, opts) {
    opts = opts || {};
    var res = await fetch(API + path, Object.assign({}, opts, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    }));
    if (res.status === 401) { logout(); throw new Error('Session expired. Please sign in again.'); }
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Request failed');
    return data;
  }

  function show(loggedIn) {
    $('#login').hidden = loggedIn;
    $('#app').hidden = !loggedIn;
  }

  function logout() {
    token = null;
    sessionStorage.removeItem('admin_token');
    show(false);
  }

  /* ---------- Login ---------- */
  $('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    $('#loginError').textContent = '';
    try {
      var res = await fetch(API + 'admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: $('#password').value }),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed');
      token = data.token;
      sessionStorage.setItem('admin_token', token);
      $('#password').value = '';
      show(true);
      loadAll();
    } catch (err) {
      $('#loginError').textContent = err.message;
    }
  });

  $('#logout').addEventListener('click', logout);
  $('#refresh').addEventListener('click', loadAll);
  $('#range').addEventListener('change', loadStats);
  $('#msgFilter').addEventListener('change', loadMessages);

  /* ---------- Stats ---------- */
  function list(el, rows) {
    $(el).innerHTML = rows.length
      ? rows.map(function (r) { return '<div class="rowline"><span>' + esc(r.name) + '</span><b>' + r.count + '</b></div>'; }).join('')
      : '<p class="muted">No data yet</p>';
  }

  function draw(id, config) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($('#' + id), config);
  }

  async function loadStats() {
    $('#error').textContent = '';
    try {
      var d = await api('admin-stats?days=' + $('#range').value);
      var k = d.kpis;
      var cards = [
        ['Total visits', k.totalVisits], ['Unique visitors', k.uniqueVisitors],
        ['New visitors', k.newVisitors], ['Returning visits', k.returningVisits],
        ['Today', k.today], ['All-time visitors', k.allTimeVisitors],
        ['Visitors who came back', k.cameBackAllTime], ['Unread messages', k.messagesUnread + ' / ' + k.messagesTotal],
      ];
      $('#kpis').innerHTML = cards.map(function (c) { return '<div class="kpi"><b>' + esc(c[1]) + '</b><span>' + c[0] + '</span></div>'; }).join('');

      draw('lineChart', {
        type: 'line',
        data: {
          labels: d.daily.map(function (x) { return x.date; }),
          datasets: [
            { label: 'New visitors', data: d.daily.map(function (x) { return x.newVisitors; }), borderColor: '#8b8bff', backgroundColor: 'rgba(139,139,255,.2)', fill: true, tension: .3 },
            { label: 'Returning visits', data: d.daily.map(function (x) { return x.returning; }), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.15)', fill: true, tension: .3 },
          ],
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { labels: { color: '#e8ebf6' } } } },
      });
      draw('donut', {
        type: 'doughnut',
        data: { labels: ['New', 'Returning'], datasets: [{ data: [k.newVisitors, k.returningVisits], backgroundColor: ['#8b8bff', '#22c55e'], borderWidth: 0 }] },
        options: { plugins: { legend: { labels: { color: '#e8ebf6' } } } },
      });

      list('#sources', d.sources); list('#devices', d.devices); list('#browsers', d.browsers); list('#countries', d.countries);

      $('#recent').innerHTML = d.recent.length
        ? '<table><tr><th>Visitor</th><th>Visits</th><th>First seen</th><th>Last seen</th><th>Device</th><th>Browser</th><th>Country</th><th>Source</th></tr>' +
          d.recent.map(function (v) {
            return '<tr><td>' + esc(v.visitorId) + '</td><td>' + v.visitCount + '</td><td>' + fmt(v.firstVisit) + '</td><td>' + fmt(v.lastVisit) +
              '</td><td>' + esc(v.device) + '</td><td>' + esc(v.browser) + '</td><td>' + esc(v.country || 'Unknown') + '</td><td>' + esc(v.lastSource) + '</td></tr>';
          }).join('') + '</table>'
        : '<p class="muted">No visitors yet</p>';
    } catch (err) {
      $('#error').textContent = err.message;
    }
  }

  /* ---------- Messages ---------- */
  async function loadMessages() {
    try {
      var d = await api('admin-messages?status=' + encodeURIComponent($('#msgFilter').value));
      var unread = d.items.filter(function (m) { return m.status === 'new'; }).length;
      $('#badge').textContent = unread ? unread + ' new' : '';
      $('#messages').innerHTML = d.items.length
        ? d.items.map(function (m) {
            return '<div class="msg ' + esc(m.status) + '"><div class="meta"><b>' + esc(m.name) + '</b> &middot; ' + esc(m.email) +
              ' &middot; ' + fmt(m.createdAt) + ' <span class="tag">' + esc(m.status) + '</span>' +
              (m.emailSent ? '' : ' <span class="tag">email not sent</span>') + '</div>' +
              (m.subject ? '<b>' + esc(m.subject) + '</b>' : '') + '<p>' + esc(m.message) + '</p>' +
              '<div class="actions">' +
              '<a class="btn small" href="mailto:' + encodeURIComponent(m.email) + '?subject=' + encodeURIComponent('Re: ' + (m.subject || 'your message')) + '">Reply</a>' +
              (m.status !== 'read' ? '<button class="btn small ghost" data-act="read" data-id="' + esc(m._id) + '">Mark read</button>' : '') +
              (m.status !== 'archived' ? '<button class="btn small ghost" data-act="archived" data-id="' + esc(m._id) + '">Archive</button>' : '') +
              '<button class="btn small ghost" data-act="delete" data-id="' + esc(m._id) + '">Delete</button></div></div>';
          }).join('')
        : '<p class="muted">No messages</p>';
    } catch (err) {
      $('#error').textContent = err.message;
    }
  }

  $('#messages').addEventListener('click', async function (e) {
    var b = e.target.closest('button[data-act]');
    if (!b) return;
    try {
      if (b.dataset.act === 'delete') {
        if (!confirm('Delete this message permanently?')) return;
        await api('admin-messages?id=' + encodeURIComponent(b.dataset.id), { method: 'DELETE' });
      } else {
        await api('admin-messages', { method: 'PATCH', body: JSON.stringify({ id: b.dataset.id, status: b.dataset.act }) });
      }
      loadMessages();
      loadStats();
    } catch (err) {
      $('#error').textContent = err.message;
    }
  });

  function loadAll() { loadStats(); loadMessages(); }

  if (token) { show(true); loadAll(); } else { show(false); }
})();
```

