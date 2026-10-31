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
