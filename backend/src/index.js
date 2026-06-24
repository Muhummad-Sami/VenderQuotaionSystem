// backend/src/index.js
const app = require('./app');
const connectDB = require('./config/db');

let cachedDb = null;
let isConnecting = false;

const startServer = async () => {
  try {
    if (cachedDb) return app;
    
    if (!isConnecting) {
      isConnecting = true;
      cachedDb = await connectDB();
      console.log('✅ MongoDB connected successfully');
    } else {
      // Wait for connection if already in progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      return startServer();
    }
    return app;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
};

module.exports = async (req, res) => {
  try {
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

    // Ensure database is connected
    await startServer();
    return app(req, res);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};