const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, user, action, details = {}) => {
  try {
    await ActivityLog.create({
      user: user._id,
      userEmail: user.email,
      userRole: user.role,
      action,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
    });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

// Middleware to log authentication actions
const logAuthActivity = (action) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    res.send = function(data) {
      // If login/register was successful, log it
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          const body = JSON.parse(data);
          if (body.user) {
            logActivity(req, body.user, action, { 
              timestamp: new Date().toISOString() 
            });
          }
        } catch (e) {}
      }
      originalSend.call(this, data);
    };
    next();
  };
};

module.exports = { logActivity, logAuthActivity };