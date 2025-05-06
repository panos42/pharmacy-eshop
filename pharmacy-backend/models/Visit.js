// models/Visit.js
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  isConversion: {
    type: Boolean,
    default: false
  },
  source: String  // Optional: track where the visit came from
});

module.exports = mongoose.model('Visit', VisitSchema);