const router = require('express').Router();
const ChecklistItem = require('../models/ChecklistItem');

// GET all checklist items (optionally filter by dayIndex or category)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.dayIndex !== undefined) filter.dayIndex = req.query.dayIndex === 'null' ? null : Number(req.query.dayIndex);
    if (req.query.category) filter.category = req.query.category;
    const items = await ChecklistItem.find(filter).sort({ priority: 1, createdAt: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST create checklist item
router.post('/', async (req, res) => {
  try {
    const item = new ChecklistItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH toggle completion for a specific member
router.patch('/:id/complete', async (req, res) => {
  try {
    const { memberId, memberName, family } = req.body;
    const item = await ChecklistItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const existingIdx = item.completions.findIndex(c => c.memberId?.toString() === memberId);
    if (existingIdx >= 0) {
      // Uncheck — remove completion
      item.completions.splice(existingIdx, 1);
    } else {
      // Check — add completion
      item.completions.push({ memberId, memberName, family, completedAt: new Date() });
    }
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH edit item text/details
router.patch('/:id', async (req, res) => {
  try {
    const item = await ChecklistItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await ChecklistItem.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
