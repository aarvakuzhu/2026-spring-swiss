const mongoose = require('mongoose');

// One document per member — stores their last known app state
const tripStateSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', unique: true },
  memberName: String,
  family: String,
  lastDayIndex: { type: Number, default: 0 },
  lastViewedAt: { type: Date, default: Date.now },
  areasToExplore: [{ type: String }], // personal bucket list items for the trip
}, { timestamps: true });

module.exports = mongoose.model('TripState', tripStateSchema);
