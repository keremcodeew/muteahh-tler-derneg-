const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const { auth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('company').optional().trim(),
    body('role').optional().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, name, company, role } = req.body;
      const existing = await db.User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.User.create({
        email,
        password: hashedPassword,
        role: 'member',
      });
      const joinDate = new Date().toISOString().split('T')[0];
      const member = await db.Member.create({
        userId: user.id,
        name,
        email,
        company: company || null,
        role: role || null,
        joinDate,
        isApproved: false,
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
        member: { id: member.id, name: member.name, company: member.company },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      const member = await db.Member.findOne({ where: { userId: user.id } });
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
        member: member ? { id: member.id, name: member.name, company: member.company } : null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/auth/me - validate token and return current user
router.get('/me', auth, async (req, res) => {
  try {
    const member = await db.Member.findOne({ where: { userId: req.user.id } });
    res.json({
      user: { id: req.user.id, email: req.user.email, role: req.user.role },
      member: member ? {
        id: member.id,
        name: member.name,
        email: member.email,
        company: member.company,
        role: member.role,
        profileImageUrl: member.profileImageUrl,
        joinDate: member.joinDate,
      } : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
