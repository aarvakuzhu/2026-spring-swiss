const router = require('express').Router();
const ChecklistItem = require('../models/ChecklistItem');
const Member = require('../models/Member');
const TripState = require('../models/TripState');

const DEFAULT_CHECKLIST = [
  // ── BEFORE TRAVEL ──
  { category: 'before-travel', text: 'Purchase Swiss Travel Pass (Adult + Child)', isBookingRequired: true, bookingUrl: 'https://www.swisstravelsystem.com/en/swiss-travel-pass/', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Book GoldenPass Express reservation (Geneva → Interlaken, Apr 5)', isBookingRequired: true, bookingUrl: 'https://www.goldenpass.ch/en/goldenpass-express/reservation', priority: 'high', relevantFamilies: ['ashok'] },
  { category: 'before-travel', text: 'Book Schilthorn tickets — Piz Gloria + Thrill Walk (Apr 6)', isBookingRequired: true, bookingUrl: 'https://www.schilthorn.ch/en/planning/tickets/online-tickets', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Book Grindelwald First gondola + Cliff Walk (Apr 7)', isBookingRequired: true, bookingUrl: 'https://www.jungfrau.ch/en-gb/grindelwald-first/tickets/', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Book Klein Matterhorn / Matterhorn Glacier Paradise (Apr 8)', isBookingRequired: true, bookingUrl: 'https://www.matterhornparadise.ch/en/experience/tickets-prices', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Book Lindt Home of Chocolate — Zürich (Apr 10)', isBookingRequired: true, bookingUrl: 'https://www.lindt-home-of-chocolate.com/en/tickets/', priority: 'medium', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Download SBB Mobile App', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Download MeteoSwiss App', priority: 'medium', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Notify bank / credit cards of Switzerland travel', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Get Swiss Francs (CHF) — ATMs widely available in Switzerland', priority: 'medium', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'International data plan for Switzerland', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'before-travel', text: 'Check passport expiry — must be valid 6+ months past Apr 12', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },

  // ── PACKING ──
  { category: 'packing', text: 'Warm layers — summit temps can be −5°C even in April', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Waterproof jacket / rain gear for each person', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Sturdy walking shoes / light hiking boots', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Sunscreen + sunglasses (glacier UV is intense)', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Power adapter — Switzerland uses Type J (3-pin)', priority: 'high', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Portable power bank for long days out', priority: 'medium', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Kids: snacks, earphones, entertainment for long train rides', priority: 'medium', relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'packing', text: 'Camera / extra memory cards', priority: 'low', relevantFamilies: ['ashok', 'rajesh'] },

  // ── AREAS TO EXPLORE ──
  { category: 'note', text: 'Rifelsee Lake reflection of Matterhorn — best at sunrise', dayIndex: 4, relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'note', text: 'Grindelwald First — try the Flyer zipline if open in April', dayIndex: 3, relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'note', text: 'Lauterbrunnen Valley — 72 waterfalls visible from the road', dayIndex: 2, relevantFamilies: ['ashok', 'rajesh'] },
  { category: 'note', text: 'Zurich Lindenhügel — quiet hill with panoramic city view', dayIndex: 6, relevantFamilies: ['ashok', 'rajesh'] },
];

// GET /api/seed/:token — trigger from browser
router.get('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    const existing = await ChecklistItem.countDocuments();
    if (existing === 0) {
      await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
      res.json({ ok: true, seeded: DEFAULT_CHECKLIST.length });
    } else {
      res.json({ ok: true, skipped: true, existing });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/seed  — protected by a secret token
router.post('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const results = {};

    // Seed checklist
    const existingChecklist = await ChecklistItem.countDocuments();
    if (existingChecklist === 0) {
      await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
      results.checklist = `Seeded ${DEFAULT_CHECKLIST.length} items`;
    } else {
      results.checklist = `Skipped — ${existingChecklist} items already exist`;
    }

    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/seed/:token — wipe and re-seed (use carefully)
router.delete('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    await ChecklistItem.deleteMany({});
    await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
    res.json({ ok: true, message: `Re-seeded ${DEFAULT_CHECKLIST.length} checklist items` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
