const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  otpExpiryMinutes: {
    type: Number,
    default: 10,
    min: 5,
    max: 30
  },
  sessionTimeoutMinutes: {
    type: Number,
    default: 60
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 50
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: String,
  cancellationPolicy: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
