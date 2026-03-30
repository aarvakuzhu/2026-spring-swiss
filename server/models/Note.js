const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  dayIndex: { type: Number, required: true },  // 0–7 maps to Apr 4–11
  text: { type: String, required: true },
  addedBy: { type: String, required: true },      // member name
  addedByFamily: { type: String, required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  pinned: { type: Boolean, default: false },
  type: { type: String, enum: ['note', 'tip', 'warning', 'interest'], default: 'note' },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
