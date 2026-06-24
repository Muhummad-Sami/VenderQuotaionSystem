// backend/src/index.js
const app = require('./app');
const connectDB = require('./config/db');

let cachedDb = null;

module.exports = async (req, res) => {
  try {
    console.log('🔹 Request received:', req.method, req.url);

    // CORS headers
    const allowedOrigins = [
      'https://vender-quotaion-system-1iu2.vercel.app',
      'https://vender-quotaion-system.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
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
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Connect to database (cache connection)
    if (!cachedDb) {
      console.log('🔹 Connecting to MongoDB...');
      cachedDb = await connectDB();
      console.log('✅ MongoDB connected');
    }

    console.log('🔹 Passing request to Express app...');
    return app(req, res);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('❌ Stack:', error.stack);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};