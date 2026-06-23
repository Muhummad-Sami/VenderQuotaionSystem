const mongoose = require('mongoose');

const QuotationRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'awarded'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('QuotationRequest', QuotationRequestSchema);