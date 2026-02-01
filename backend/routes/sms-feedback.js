const express = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../models');
const { auth, platformAdminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public: POST /api/sms-feedback
router.post(
  '/',
  [
    body('phoneE164').trim().notEmpty().isLength({ min: 6, max: 32 }),
    body('message').trim().notEmpty().isLength({ min: 5, max: 5000 }),
    body('name').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
    body('source').optional({ checkFalsy: true }).trim().isLength({ max: 64 }),
  ],
  validate,
  async (req, res) => {
    try {
      const created = await db.SmsFeedback.create({
        phoneE164: req.body.phoneE164,
        message: req.body.message,
        name: req.body.name || null,
        email: req.body.email || null,
        source: req.body.source || 'web',
        status: 'new',
      });
      res.status(201).json({ success: true, id: created.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: GET /api/sms-feedback/admin/all
router.get(
  '/admin/all',
  auth,
  platformAdminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 200 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 50;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.SmsFeedback.findAndCountAll({
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

