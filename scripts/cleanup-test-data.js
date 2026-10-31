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
