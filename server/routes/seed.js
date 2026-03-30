const router = require('express').Router();
const ChecklistItem = require('../models/ChecklistItem');
const Member = require('../models/Member');
const TripState = require('../models/TripState');
const MEMBERS = require('../seedMembers');

const DEFAULT_CHECKLIST = [

  // ══════════════════════════════════
  // THINGS TO BUY — common for everyone
  // ══════════════════════════════════
  { category: 'packing', priority: 'high',   text: 'Backpacks — one per person, day-hike size (20–30L)',         relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Charger adapter — Switzerland uses Type J (3-pin)',           relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Disposable rain coat — one per person',                       relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'medium', text: 'Refillable water bottle — can reuse existing',               relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Waterproof shoes / boots — essential for mountain days',     relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Compact travel umbrella',                                     relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'medium', text: 'Hand warmers — on sale at Kroger!',                          relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Jacket — warm, windproof (summit temps can be −5°C)',        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Ear muffs or hat, gloves, and scarf',                        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'medium', text: 'Vaseline or chapstick — cold air dries lips fast',           relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'medium', text: 'Sunglasses — glacier UV is intense even in April',           relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'medium', text: 'Snacks for train rides — kids especially',                   relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', priority: 'high',   text: 'Thermal wear / base layers',                                 relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },

  // Individual — KP / ladies
  { category: 'packing', priority: 'medium', text: 'Makeup items and coconut oil',                               relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },

  // ══════════════════════════════════
  // BEFORE TRAVEL — bookings & admin
  // ══════════════════════════════════
  { category: 'before-travel', priority: 'high',   text: 'Purchase Swiss Travel Pass — Adult + Child',           relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.swisstravelsystem.com/en/swiss-travel-pass/' },
  { category: 'before-travel', priority: 'high',   text: 'Book GoldenPass Express seat (Apr 5 Geneva → Interlaken)', relevantFamilies: ['ashok'],       isBookingRequired: true,  bookingUrl: 'https://www.goldenpass.ch/en/goldenpass-express/reservation' },
  { category: 'before-travel', priority: 'high',   text: 'Book Schilthorn / Piz Gloria + Thrill Walk (Apr 6)',   relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.schilthorn.ch/en/planning/tickets/online-tickets' },
  { category: 'before-travel', priority: 'high',   text: 'Book Grindelwald First Cliff Walk gondola (Apr 7)',    relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.jungfrau.ch/en-gb/grindelwald-first/tickets/' },
  { category: 'before-travel', priority: 'high',   text: 'Book Klein Matterhorn / Glacier Paradise (Apr 8)',     relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.matterhornparadise.ch/en/experience/tickets-prices' },
  { category: 'before-travel', priority: 'medium', text: 'Book Lindt Home of Chocolate — Zürich (Apr 10)',       relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.lindt-home-of-chocolate.com/en/tickets/' },
  { category: 'before-travel', priority: 'high',   text: 'Check passport expiry — must be valid 6+ months past Apr 12', relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'high',   text: 'Notify bank / credit cards of Switzerland travel',     relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'high',   text: 'Set up international data plan for Switzerland',       relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'high',   text: 'Download SBB Mobile App (Swiss trains)',               relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'medium', text: 'Download MeteoSwiss App (mountain weather)',           relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'medium', text: 'Get some Swiss Francs (CHF) — ATMs available too',    relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', priority: 'medium', text: 'Print / save hotel addresses and confirmation numbers offline', relevantFamilies: ['ashok','rajesh'] },

  // ══════════════════════════════════
  // AREAS TO EXPLORE / NOTES
  // ══════════════════════════════════
  { category: 'note', dayIndex: 4, text: 'Rifelsee Lake — Matterhorn reflection, best before 9 AM',             relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', dayIndex: 3, text: 'Grindelwald First — ask about Trottibike scooter downhill',           relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', dayIndex: 2, text: 'Lauterbrunnen — 72 waterfalls visible from the valley road',          relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', dayIndex: 6, text: 'Zürich Lindenhügel hill — panoramic city view, 10 min walk',         relevantFamilies: ['ashok','rajesh'] },
];

// ── GET seed checklist ──
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

// ── GET reseed checklist (wipe + redo) ──
router.get('/reseed/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    await ChecklistItem.deleteMany({});
    await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
    res.json({ ok: true, reseeded: DEFAULT_CHECKLIST.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST seed (original) ──
router.post('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    const results = {};
    const existingChecklist = await ChecklistItem.countDocuments();
    if (existingChecklist === 0) {
      await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
      results.checklist = `Seeded ${DEFAULT_CHECKLIST.length} items`;
    } else {
      results.checklist = `Skipped — ${existingChecklist} items already exist`;
    }
    res.json({ ok: true, results });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DELETE reseed ──
router.delete('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    await ChecklistItem.deleteMany({});
    await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
    res.json({ ok: true, message: `Re-seeded ${DEFAULT_CHECKLIST.length} checklist items` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET seed members ──
router.get('/members/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    const existing = await Member.countDocuments();
    if (existing > 0) return res.json({ ok: true, skipped: true, existing });
    const created = [];
    for (const m of MEMBERS) {
      const member = await Member.create(m);
      await TripState.create({ memberId: member._id, memberName: member.name, family: member.family });
      created.push(member.name);
    }
    res.json({ ok: true, seeded: created });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET reseed members ──
router.get('/members-reseed/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    await Member.deleteMany({});
    await TripState.deleteMany({});
    const created = [];
    for (const m of MEMBERS) {
      const member = await Member.create(m);
      await TripState.create({ memberId: member._id, memberName: member.name, family: member.family });
      created.push(member.name);
    }
    res.json({ ok: true, reseeded: created });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
