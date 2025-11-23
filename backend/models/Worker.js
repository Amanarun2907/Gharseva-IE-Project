const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceCategory: {
    type: String,
    required: [true, 'Please provide a service category']
  },
  experience: {
    type: Number,
    default: 0
  },
  serviceCharges: {
    type: Number,
    required: [true, 'Please provide service charges']
  },
  skills: [{
    type: String
  }],
  profilePhoto: {
    type: String,
    default: ''
  },
  documents: [{
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'police_verification']
    },
    filePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDate: Date,
  rejectionReason: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: Number,
    default: 30
  },
  isTopRated: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
