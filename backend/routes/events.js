const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/events/upcoming - public list for sidebar
router.get('/upcoming', async (req, res) => {
  try {
    const limit = Number(req.query.limit || 5);
    const today = new Date().toISOString().split('T')[0];
    const items = await db.Event.findAll({
      where: {
        isPublished: true,
        // if eventDate is null, still include but sort after dated ones
      },
      order: [
        ['sortOrder', 'ASC'],
        ['eventDate', 'ASC'],
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
      limit: Math.min(Math.max(limit, 1), 20),
    });

    // Filter out past events when eventDate exists
    const filtered = items.filter((e) => !e.eventDate || String(e.eventDate) >= today);
    res.json(filtered.slice(0, Math.min(Math.max(limit, 1), 20)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events - public list with pagination (optional)
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.Event.findAndCountAll({
        where: { isPublished: true },
        order: [['sortOrder', 'ASC'], ['eventDate', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/events/admin/all - admin list
router.get(
  '/admin/all',
  auth,
  adminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 500 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 50;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.Event.findAndCountAll({
        order: [['sortOrder', 'ASC'], ['eventDate', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/events - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('dateText').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
    body('eventDate').optional({ checkFalsy: true }).isDate(),
    body('location').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('color').optional({ checkFalsy: true }).trim().isLength({ max: 32 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Event.create({
        title: req.body.title,
        dateText: req.body.dateText || null,
        eventDate: req.body.eventDate || null,
        location: req.body.location || null,
        color: req.body.color || 'burgundy',
        sortOrder: req.body.sortOrder ?? 0,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/events/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty(),
    body('dateText').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
    body('eventDate').optional({ checkFalsy: true }).isDate(),
    body('location').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('color').optional({ checkFalsy: true }).trim().isLength({ max: 32 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Event.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Event not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.dateText !== undefined && { dateText: req.body.dateText }),
        ...(req.body.eventDate !== undefined && { eventDate: req.body.eventDate }),
        ...(req.body.location !== undefined && { location: req.body.location }),
        ...(req.body.color !== undefined && { color: req.body.color }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/events/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Event.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Event not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

