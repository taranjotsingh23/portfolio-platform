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
