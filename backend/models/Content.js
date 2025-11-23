const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    enum: ['homepage_banner', 'faq', 'terms', 'privacy', 'about'],
    required: true,
    unique: true
  },
  title: String,
  content: String,
  imageUrl: String,
  displayDuration: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
