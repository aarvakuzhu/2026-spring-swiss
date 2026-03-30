const router = require('express').Router();
const Note = require('../models/Note');

// GET notes for a specific day
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.dayIndex !== undefined) filter.dayIndex = Number(req.query.dayIndex);
    if (req.query.family) filter.addedByFamily = req.query.family;
    const notes = await Note.find(filter).sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST add note
router.post('/', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH pin/edit note
router.patch('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
