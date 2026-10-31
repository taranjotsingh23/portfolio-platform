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
