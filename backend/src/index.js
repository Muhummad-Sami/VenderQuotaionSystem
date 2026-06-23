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
  // ============================================================
  // ✅ CORS HEADERS – Allow Your Frontend
  // ============================================================
  const allowedOrigins = [
    'https://vender-quotaion-system-1iu2.vercel.app', // Your frontend URL
    'https://vender-quotaion-system.vercel.app',      // Your backend URL (if needed)
    'http://localhost:5173',                          // Local development
    'http://localhost:3000',                          // Local development
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // ============================================================
  // ✅ Handle preflight OPTIONS request
  // ============================================================
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await startServer();
  return app(req, res);
};