const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  age: { type: Number, required: true },
  height: { type: String }, // e.g. "5'9"
  maritalStatus: { type: String, required: true }, // Single, Divorced, Widowed
  religion: { type: String, required: true },
  caste: { type: String, required: true },
  education: { type: String },
  occupation: { type: String },
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  mobile: { type: String, required: true }, // Contact number to show
  description: { type: String }, // "About user"
  fatherName: { type: String },
  motherName: { type: String },
  gotra: { type: String },
  familyDetails: { type: String },
  photos: [{ type: String }], // Array of image URLs
  isApproved: { type: Boolean, default: false }, // Admin approval
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
