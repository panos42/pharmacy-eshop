// models/Visit.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sessionId: String,
  page: String,
  referrer: String,
  date: { type: Date, default: Date.now },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  }
});

module.exports = mongoose.model('Visit', visitSchema);