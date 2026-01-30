require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const announcementsRoutes = require('./routes/announcements');
const membersRoutes = require('./routes/members');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.UPLOAD_DIR) {
  app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR)));
}

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/members', membersRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error.' });
});

module.exports = app;
