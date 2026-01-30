const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
const { Op } = require('sequelize');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/news - public list with pagination
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.News.findAndCountAll({
        where: { isPublished: true },
        order: [['publishDate', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/news/admin/all - admin: all news including unpublished
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.News.findAndCountAll({
      order: [['publishDate', 'DESC'], ['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/news/slider - latest for homepage slider
router.get('/slider', async (req, res) => {
  try {
    const items = await db.News.findAll({
      where: { isPublished: true },
      order: [['publishDate', 'DESC']],
      limit: 8,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/news/:id
router.get('/:id', [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.News.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'News not found.' });
    if (!item.isPublished && !req.headers.authorization) {
      return res.status(404).json({ error: 'News not found.' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST, PUT, DELETE - admin only
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('publishDate').optional().isDate(),
    body('excerpt').optional().trim(),
    body('imageUrl').optional().trim(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const publishDate = req.body.publishDate || new Date().toISOString().split('T')[0];
      const item = await db.News.create({
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt || req.body.content.slice(0, 200),
        imageUrl: req.body.imageUrl || null,
        publishDate,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('publishDate').optional().isDate(),
    body('excerpt').optional().trim(),
    body('imageUrl').optional().trim(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.News.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'News not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.content !== undefined && { content: req.body.content }),
        ...(req.body.excerpt !== undefined && { excerpt: req.body.excerpt }),
        ...(req.body.imageUrl !== undefined && { imageUrl: req.body.imageUrl }),
        ...(req.body.publishDate !== undefined && { publishDate: req.body.publishDate }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.News.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'News not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
