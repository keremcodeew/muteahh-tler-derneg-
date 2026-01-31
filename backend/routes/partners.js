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

// GET /api/partners - public list for logo slider
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 200 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const limit = req.query.limit || 50;
      const items = await db.Partner.findAll({
        where: { isPublished: true },
        order: [['sortOrder', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
      });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/partners/admin/all - admin list
router.get(
  '/admin/all',
  auth,
  adminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 500 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.Partner.findAndCountAll({
        order: [['sortOrder', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/partners - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty().isLength({ max: 255 }),
    body('logoText').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('logoUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Partner.create({
        title: req.body.title,
        logoText: req.body.logoText || null,
        logoUrl: req.body.logoUrl || null,
        sortOrder: req.body.sortOrder ?? 0,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/partners/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('logoText').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('logoUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Partner.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Partner not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.logoText !== undefined && { logoText: req.body.logoText }),
        ...(req.body.logoUrl !== undefined && { logoUrl: req.body.logoUrl }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/partners/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Partner.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Partner not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

