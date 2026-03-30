require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── DB ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// ── API Routes ──
app.use('/api/members',   require('./routes/members'));
app.use('/api/checklist', require('./routes/checklist'));
app.use('/api/notes',     require('./routes/notes'));
app.use('/api/seed',      require('./routes/seed'));
app.use('/api/chat',      require('./routes/chat'));
app.use('/api/flights',    require('./routes/flights'));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── Serve frontend for all other routes ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`🚂 Swiss planner running on port ${PORT}`));
