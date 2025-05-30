const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  voltage: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
deviceSchema.index({ device_id: 1, timestamp: -1 });

module.exports = mongoose.model('Device', deviceSchema);