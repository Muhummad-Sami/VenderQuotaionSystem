const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'vendor'],
    default: 'vendor',
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorProfile',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);