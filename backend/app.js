require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const announcementsRoutes = require('./routes/announcements');
const membersRoutes = require('./routes/members');
const slidesRoutes = require('./routes/slides');
const videosRoutes = require('./routes/videos');
const publicationsRoutes = require('./routes/publications');
const pagesRoutes = require('./routes/pages');
const eventsRoutes = require('./routes/events');
const partnersRoutes = require('./routes/partners');
const smsFeedbackRoutes = require('./routes/sms-feedback');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
// NOTE: We allow larger JSON bodies to support base64 document uploads.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.UPLOAD_DIR) {
  app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR)));
}

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/slides', slidesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/sms-feedback', smsFeedbackRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error.' });
});

module.exports = app;
