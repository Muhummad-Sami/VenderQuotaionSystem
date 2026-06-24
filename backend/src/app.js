// backend/src/app.js
const express = require('express');
const cors = require('cors');
const compression = require('compression'); // ✅ ADD THIS
const authRoutes = require('./routes/auth.routes');
const vendorRoutes = require('./routes/vendor.routes');
const requestRoutes = require('./routes/request.routes');
const offerRoutes = require('./routes/offer.routes');
const pdfRoutes = require('./routes/pdf.routes');
const activityRoutes = require('./routes/activity.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ============================================================
// ✅ Compression – Smaller responses = Faster loading
// ============================================================
const compression = require('compression');
app.use(compression());
// ============================================================
// ✅ CORS Middleware – Allow Your Frontend
// ============================================================
const allowedOrigins = [
  'https://vender-quotaion-system-1iu2.vercel.app', // Your frontend URL
  'https://vender-quotaion-system.vercel.app',      // Your backend URL
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ============================================================
// ✅ Express Middleware
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ✅ Routes
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/activities', activityRoutes);

// ============================================================
// ✅ Health Check (keep warm)
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ============================================================
// ✅ Ping Endpoint – For cron job to keep function warm
// ============================================================
app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Function is warm!'
  });
});

// ============================================================
// ✅ Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;