const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/pages/admin/:slug - admin
router.get('/admin/:slug', auth, adminOnly, [param('slug').trim().isLength({ min: 1, max: 64 })], validate, async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = await db.PageContent.findOne({ where: { slug } });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/pages/admin/:slug - admin upsert
router.put(
  '/admin/:slug',
  auth,
  adminOnly,
  [
    param('slug').trim().isLength({ min: 1, max: 64 }),
    body('heroTitle').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('heroSubtitle').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('aboutTitle').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('aboutParagraph1').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
    body('aboutParagraph2').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
    body('aboutPdfTitle').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('aboutPdfUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('quickInfo').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
    body('mission').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
    body('vision').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const slug = req.params.slug;
      const payload = {
        slug,
        ...(req.body.heroTitle !== undefined && { heroTitle: req.body.heroTitle }),
        ...(req.body.heroSubtitle !== undefined && { heroSubtitle: req.body.heroSubtitle }),
        ...(req.body.aboutTitle !== undefined && { aboutTitle: req.body.aboutTitle }),
        ...(req.body.aboutParagraph1 !== undefined && { aboutParagraph1: req.body.aboutParagraph1 }),
        ...(req.body.aboutParagraph2 !== undefined && { aboutParagraph2: req.body.aboutParagraph2 }),
        ...(req.body.aboutPdfTitle !== undefined && { aboutPdfTitle: req.body.aboutPdfTitle }),
        ...(req.body.aboutPdfUrl !== undefined && { aboutPdfUrl: req.body.aboutPdfUrl }),
        ...(req.body.quickInfo !== undefined && { quickInfo: req.body.quickInfo }),
        ...(req.body.mission !== undefined && { mission: req.body.mission }),
        ...(req.body.vision !== undefined && { vision: req.body.vision }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      };

      const existing = await db.PageContent.findOne({ where: { slug } });
      if (!existing) {
        const created = await db.PageContent.create(payload);
        return res.status(201).json(created);
      }
      await existing.update(payload);
      res.json(existing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/pages/:slug - public
router.get('/:slug', [param('slug').trim().isLength({ min: 1, max: 64 })], validate, async (req, res) => {
  try {
    const slug = req.params.slug;
    const page = await db.PageContent.findOne({ where: { slug, isPublished: true } });
    if (!page) return res.status(404).json({ error: 'Page not found.' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

