const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shape: { type: mongoose.Schema.Types.ObjectId, ref: 'Shape', required: true },
  isSuccess: { type: Boolean, required: true },
  accuracyScore: { type: Number },
  timeTaken: { type: Number },
  // The raw movement data for replay/analysis
  traceData: [{
    x: Number,
    y: Number,
    timestamp: Number
  }],
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', AttemptSchema);