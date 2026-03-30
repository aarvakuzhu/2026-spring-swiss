const router = require('express').Router();
const ChecklistItem = require('../models/ChecklistItem');
const Member = require('../models/Member');
const TripState = require('../models/TripState');
const MEMBERS = require('../seedMembers');

const DEFAULT_CHECKLIST = [

  // ══════════════════════════════════
  // THINGS TO BUY / PACK — all members
  // ══════════════════════════════════
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Backpack — day-hike size (20–30L), one per person',              relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Charger adapter — Switzerland uses Type J (3-pin)',              relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Disposable rain coat — one per person',                         relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'medium', text: 'Refillable water bottle — can reuse existing',                  relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Waterproof shoes / boots — essential for mountain days',        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Compact travel umbrella',                                       relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'medium', text: 'Hand warmers — on sale at Kroger!',                            relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Jacket — warm and windproof (summit temps −5°C)',               relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Ear muffs or hat, gloves, and scarf',                          relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'medium', text: 'Vaseline or chapstick — cold dry air is tough on lips',        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'medium', text: 'Sunglasses — glacier UV is intense even in April',             relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'medium', text: 'Snacks for train rides',                                        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'all', priority: 'high',   text: 'Thermal wear / base layers',                                   relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },

  // Adults only packing
  { category: 'packing', audience: 'adults', priority: 'medium', text: 'Makeup items and coconut oil',                              relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },
  { category: 'packing', audience: 'adults', priority: 'medium', text: 'Portable power bank for long days out',                     relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'adults', priority: 'low',    text: 'Camera / extra memory cards',                               relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },

  // Kids specific packing
  { category: 'packing', audience: 'kids', priority: 'medium', text: 'Earphones + downloaded movies/games for train rides',         relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'packing', audience: 'kids', priority: 'low',    text: 'Small backpack with personal snacks and water bottle',        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },

  // ══════════════════════════════════
  // BEFORE TRAVEL — adults only
  // ══════════════════════════════════
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Purchase Swiss Travel Pass — Adult + Child (all 8 people)',       relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.sbb.ch/en/tickets-offers/tickets/guests-abroad/swiss-travel-pass.html' },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Book GoldenPass Express seat reservation (Apr 5, Geneva → Interlaken)', relevantFamilies: ['ashok'],       isBookingRequired: true,  bookingUrl: 'https://www.goldenpass.ch/en' },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Book Schilthorn / Piz Gloria + Thrill Walk tickets (Apr 6)',       relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://shop.schilthorn.ch/en/single-tickets' },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Book Grindelwald First Cliff Walk gondola (Apr 7)',                relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.jungfrau.ch/en-gb/grindelwald-first/tickets/' },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Book Klein Matterhorn / Glacier Paradise (Apr 8)',                 relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.matterhornparadise.ch/en/tickets-and-prices/tickets' },
  { category: 'before-travel', audience: 'adults', priority: 'medium', text: 'Book Lindt Home of Chocolate — Zürich (Apr 10)',                   relevantFamilies: ['ashok','rajesh'], isBookingRequired: true,  bookingUrl: 'https://www.lindt-home-of-chocolate.com/en/tickets/' },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Check all passports — valid 6+ months beyond Apr 12',             relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Notify bank / credit cards of Switzerland travel dates',           relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Set up international data plan for Switzerland',                   relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'high',   text: 'Download SBB Mobile App (Swiss train schedules + tickets)',        relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'medium', text: 'Download MeteoSwiss App (accurate mountain weather)',              relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'medium', text: 'Get some Swiss Francs (CHF) — ATMs also available everywhere',    relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'medium', text: 'Save hotel addresses + confirmation numbers offline',              relevantFamilies: ['ashok','rajesh'] },
  { category: 'before-travel', audience: 'adults', priority: 'medium', text: 'Share itinerary and emergency contacts with both families',        relevantFamilies: ['ashok','rajesh'] },

  // ══════════════════════════════════
  // DURING TRAVEL — group coordination, collecting, locations
  // ══════════════════════════════════
  { category: 'during-travel', audience: 'adults', priority: 'high',   text: 'Who carries the Swiss Travel Passes each day?',              relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'during-travel', audience: 'adults', priority: 'high',   text: 'Portable charger — designate one person per family',         relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'during-travel', audience: 'adults', priority: 'medium', text: 'Emergency contact list saved offline on all adult phones',    relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Agree on a meeting point at each major attraction',          relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'during-travel', audience: 'all',    priority: 'low',    text: 'Swiss chocolate — Lindt, Läderach, Sprüngli, local shops',   relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },
  { category: 'during-travel', audience: 'all',    priority: 'low',    text: 'Swiss army knife / Victorinox souvenir',                     relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },
  { category: 'during-travel', audience: 'all',    priority: 'low',    text: 'Postcards or local keepsakes to bring home',                 relevantFamilies: ['ashok','rajesh'], addedBy: 'KP' },
  { category: 'during-travel', audience: 'all',    priority: 'low',    text: 'Local cheese or Swiss food items to pack back',              relevantFamilies: ['ashok','rajesh'], addedBy: 'Anitha' },
  { category: 'during-travel', audience: 'kids',   priority: 'low',    text: 'Edelweiss or Alps souvenir for school show-and-tell',        relevantFamilies: ['ashok','rajesh'], addedBy: 'Ashok' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Apr 6 — Try fondue or raclette in Mürren/Lauterbrunnen',    relevantFamilies: ['ashok','rajesh'], dayIndex: 2, addedBy: 'Anitha' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Apr 7 — Walk Grindelwald village at golden hour',            relevantFamilies: ['ashok','rajesh'], dayIndex: 3, addedBy: 'KP' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Apr 8 — Family photo at Rifelsee lake (Matterhorn reflection)', relevantFamilies: ['ashok','rajesh'], dayIndex: 4, addedBy: 'KP' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Apr 9 — Feed the swans on Lake Lucerne',                    relevantFamilies: ['ashok','rajesh'], dayIndex: 5, addedBy: 'Anitha' },
  { category: 'during-travel', audience: 'all',    priority: 'medium', text: 'Apr 10 — Group photo in Zurich old town',                   relevantFamilies: ['ashok','rajesh'], dayIndex: 6, addedBy: 'KP' },

  // ══════════════════════════════════
  // AREAS TO EXPLORE — notes, all
  // ══════════════════════════════════
  { category: 'note', audience: 'all', dayIndex: 4, text: 'Rifelsee Lake — Matterhorn reflection best before 9 AM',                relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', audience: 'all', dayIndex: 3, text: 'Grindelwald First — ask about Trottibike scooter downhill ride',        relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', audience: 'all', dayIndex: 2, text: 'Lauterbrunnen — 72 waterfalls visible from the valley road',            relevantFamilies: ['ashok','rajesh'] },
  { category: 'note', audience: 'all', dayIndex: 6, text: 'Zürich Lindenhügel hill — panoramic city view, 10 min walk from town', relevantFamilies: ['ashok','rajesh'] },
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

// ── GET reseed checklist ──
router.get('/reseed/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    await ChecklistItem.deleteMany({});
    await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
    res.json({ ok: true, reseeded: DEFAULT_CHECKLIST.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── POST seed ──
router.post('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    const existing = await ChecklistItem.countDocuments();
    if (existing === 0) {
      await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
      res.json({ ok: true, results: { checklist: `Seeded ${DEFAULT_CHECKLIST.length} items` } });
    } else {
      res.json({ ok: true, results: { checklist: `Skipped — ${existing} items already exist` } });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── DELETE reseed ──
router.delete('/:token', async (req, res) => {
  if (req.params.token !== 'swiss2026-seed-now') return res.status(403).json({ error: 'Forbidden' });
  try {
    await ChecklistItem.deleteMany({});
    await ChecklistItem.insertMany(DEFAULT_CHECKLIST);
    res.json({ ok: true, message: `Re-seeded ${DEFAULT_CHECKLIST.length} items` });
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
