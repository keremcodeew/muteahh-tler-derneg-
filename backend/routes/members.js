const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/members - public directory (approved only), with search & pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('search').optional().trim(),
    query('company').optional().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 12;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const company = req.query.company || '';
      const where = { isApproved: true };
      if (search) {
        const s = `%${search.toLowerCase()}%`;
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), Op.like, s),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('company')), Op.like, s),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role')), Op.like, s),
        ];
      }
      if (company) {
        where.company = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('company')), Op.like, `%${company.toLowerCase()}%`);
      }
      const { count, rows } = await db.Member.findAndCountAll({
        where,
        order: [['joinDate', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'name', 'email', 'company', 'role', 'profileImageUrl', 'joinDate'],
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: GET all members (including unapproved) - must be before /:id
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Member.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members/:id - public profile
router.get('/:id', [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const member = await db.Member.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'company', 'role', 'profileImageUrl', 'joinDate'],
    });
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    if (!member.isApproved) return res.status(404).json({ error: 'Member not found.' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: POST member
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('company').optional().trim(),
    body('role').optional().trim(),
    body('profileImageUrl').optional().trim(),
    body('joinDate').optional().isDate(),
    body('isApproved').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const joinDate = req.body.joinDate || new Date().toISOString().split('T')[0];
      const member = await db.Member.create({
        name: req.body.name,
        email: req.body.email,
        company: req.body.company || null,
        role: req.body.role || null,
        profileImageUrl: req.body.profileImageUrl || null,
        joinDate,
        isApproved: req.body.isApproved !== false,
      });
      res.status(201).json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: PUT member
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('company').optional().trim(),
    body('role').optional().trim(),
    body('profileImageUrl').optional().trim(),
    body('joinDate').optional().isDate(),
    body('isApproved').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const member = await db.Member.findByPk(req.params.id);
      if (!member) return res.status(404).json({ error: 'Member not found.' });
      await member.update({
        ...(req.body.name !== undefined && { name: req.body.name }),
        ...(req.body.email !== undefined && { email: req.body.email }),
        ...(req.body.company !== undefined && { company: req.body.company }),
        ...(req.body.role !== undefined && { role: req.body.role }),
        ...(req.body.profileImageUrl !== undefined && { profileImageUrl: req.body.profileImageUrl }),
        ...(req.body.joinDate !== undefined && { joinDate: req.body.joinDate }),
        ...(req.body.isApproved !== undefined && { isApproved: req.body.isApproved }),
      });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: DELETE member
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const member = await db.Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    if (member.userId) {
      await db.User.destroy({ where: { id: member.userId } });
    }
    await member.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
