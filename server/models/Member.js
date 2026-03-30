const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  family: { type: String, enum: ['ashok', 'rajesh'], required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ['adult', 'kid'], required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  interests: [{ type: String }],  // e.g. ['hiking', 'photography', 'food', 'museums']
  avatar: { type: String },       // emoji or initials
  color: { type: String },        // hex color for this member's UI accent
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
