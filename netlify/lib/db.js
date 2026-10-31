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
