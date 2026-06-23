const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ['admin', 'vendor'],
    required: true,
  },
  action: {
    type: String,
    enum: [
      'login',
      'logout',
      'create_request',
      'update_request',
      'close_request',
      'submit_offer',
      'approve_offer',
      'reject_offer',
      'create_vendor',
      'update_vendor',
      'delete_vendor',
    ],
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);