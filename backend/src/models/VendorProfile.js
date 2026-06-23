const mongoose = require('mongoose');

const VendorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  vendorName: {
    type: String,
    required: [true, 'Vendor name is required'],
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('VendorProfile', VendorProfileSchema);