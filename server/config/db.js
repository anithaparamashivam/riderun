const mongoose = require('mongoose');

async function connectDB(uri) {
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
}

module.exports = { connectDB };
