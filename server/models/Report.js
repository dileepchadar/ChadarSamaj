const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, can be anonymous
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
