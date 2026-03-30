// server/seedMembers.js
// Triggered via GET /api/seed/members/swiss2026-seed-now
// Or run directly: MONGODB_URI=... node server/seedMembers.js

const MEMBERS = [
  // ── ASHOK FAMILY ──
  {
    family: 'ashok',
    name: 'Ashok',
    age: 45,
    role: 'adult',
    gender: 'male',
    interests: ['planning', 'family', 'photography', 'hiking'],
    avatar: '👨',
    color: '#2563EB',
  },
  {
    family: 'ashok',
    name: 'KP',
    age: 38,
    role: 'adult',
    gender: 'female',
    interests: ['photography', 'food', 'scenic views', 'travel'],
    avatar: '👩',
    color: '#7C3AED',
  },
  {
    family: 'ashok',
    name: 'Abhi',
    age: 13,
    role: 'kid',
    gender: 'male',
    interests: ['sports', 'games', 'star wars', 'lego', 'fun'],
    avatar: '🧑',
    color: '#DC2626',
  },
  {
    family: 'ashok',
    name: 'Adhar',
    age: 11,
    role: 'kid',
    gender: 'male',
    interests: ['star wars', 'fortnite', 'games', 'fun'],
    avatar: '👦',
    color: '#EA580C',
  },

  // ── RAJESH FAMILY ──
  {
    family: 'rajesh',
    name: 'Rajesh',
    age: 47,
    role: 'adult',
    gender: 'male',
    interests: ['planning', 'family', 'hiking', 'history'],
    avatar: '👨',
    color: '#059669',
  },
  {
    family: 'rajesh',
    name: 'Anitha',
    age: 47,
    role: 'adult',
    gender: 'female',
    interests: ['family', 'food', 'scenic views', 'travel'],
    avatar: '👩',
    color: '#0891B2',
  },
  {
    family: 'rajesh',
    name: 'Rajitha',
    age: 17,
    role: 'kid',
    gender: 'female',
    interests: ['art', 'photography', 'museums', 'history'],
    avatar: '👧',
    color: '#DB2777',
  },
  {
    family: 'rajesh',
    name: 'Rashmitha',
    age: 14,
    role: 'kid',
    gender: 'female',
    interests: ['origami', 'crafts', 'art', 'fun'],
    avatar: '🧒',
    color: '#D97706',
  },
];

module.exports = MEMBERS;
