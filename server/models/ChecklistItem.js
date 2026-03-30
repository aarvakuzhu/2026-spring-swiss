const mongoose = require('mongoose');

// Each checklist item is shared — but each family member tracks their own completion
const completionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  memberName: String,
  family: String,
  completedAt: Date,
}, { _id: false });

const checklistItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['before-travel', 'packing', 'booking', 'day-activity', 'note'],
    default: 'before-travel'
  },
  dayIndex: { type: Number, default: null }, // null = general, 0–7 = specific day
  text: { type: String, required: true },
  addedBy: { type: String },         // member name
  addedByFamily: { type: String },   // 'ashok' | 'rajesh'
  relevantFamilies: [{ type: String }], // ['ashok'] | ['rajesh'] | ['ashok','rajesh']
  completions: [completionSchema],   // one entry per member who completed it
  isBookingRequired: { type: Boolean, default: false },
  bookingUrl: { type: String },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
}, { timestamps: true });

module.exports = mongoose.model('ChecklistItem', checklistItemSchema);
