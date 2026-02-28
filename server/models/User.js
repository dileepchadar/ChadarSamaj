const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  otp: { type: String }, // For demo purposes, storing OTP here. In prod, use Redis or temp cache.
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
