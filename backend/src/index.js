// backend/src/index.js
// This is the Vercel serverless entry point
// Your existing server.js stays unchanged!

const app = require('./app');
const connectDB = require('./config/db');

// Cache MongoDB connection globally (important for serverless)
let cachedDb = null;

const startServer = async () => {
  if (!cachedDb) {
    cachedDb = await connectDB();
  }
  return app;
};

// Vercel handler
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Ensure DB is connected
  await startServer();
  
  // Let Express handle the request
  return app(req, res);
};