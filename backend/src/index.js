// backend/src/index.js
const app = require('./app');
const connectDB = require('./config/db');

let cachedDb = null;

const startServer = async () => {
  if (!cachedDb) {
    cachedDb = await connectDB();
  }
  return app;
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  await startServer();
  return app(req, res);
};