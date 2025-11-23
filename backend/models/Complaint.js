const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  category: {
    type: String,
    enum: ['service_quality', 'worker_behavior', 'pricing', 'delay'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  adminResponse: String,
  resolvedAt: Date
}, {
  timestamps: true
});

// Generate unique complaint ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.complaintId) {
    this.complaintId = 'CP' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
