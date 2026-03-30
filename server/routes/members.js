const router = require('express').Router();
const Member = require('../models/Member');
const TripState = require('../models/TripState');

// GET all members (optionally filtered by family)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.family ? { family: req.query.family } : {};
    const members = await Member.find(filter).sort({ family: 1, role: -1, age: -1 });
    res.json(members);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create member (used during seed/setup)
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    // Create a TripState document for this member
    await TripState.create({ memberId: member._id, memberName: member.name, family: member.family });
    res.status(201).json(member);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH update member interests/profile
router.patch('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(member);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET member's trip state
router.get('/:id/state', async (req, res) => {
  try {
    const state = await TripState.findOne({ memberId: req.params.id });
    res.json(state || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH update member's trip state (last day, areas to explore)
router.patch('/:id/state', async (req, res) => {
  try {
    const state = await TripState.findOneAndUpdate(
      { memberId: req.params.id },
      { ...req.body, lastViewedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(state);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
