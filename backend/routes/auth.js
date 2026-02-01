const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
    body('phoneCountryCode').trim().notEmpty().matches(/^\+\d{1,4}$/).withMessage('Geçersiz ülke kodu.'),
    body('phoneNumber').trim().notEmpty().matches(/^\d{4,15}$/).withMessage('Geçersiz telefon numarası.'),
    body('kvkkAccepted')
      .isBoolean()
      .toBoolean()
      .custom((v) => v === true)
      .withMessage('KVKK onayı zorunludur.'),
    body('termsAccepted')
      .isBoolean()
      .toBoolean()
      .custom((v) => v === true)
      .withMessage('Kullanım ve üyelik şartları onayı zorunludur.'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, name, company, role, phoneCountryCode, phoneNumber } = req.body;
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
      const e164 = `${String(phoneCountryCode).trim()}${String(phoneNumber).trim()}`;
      const member = await db.Member.create({
        userId: user.id,
        name,
        email,
        company: company || null,
        role: role || null,
        joinDate,
        isApproved: false,
        verificationStatus: 'pending_docs',
        phoneCountryCode: String(phoneCountryCode).trim(),
        phoneNumber: String(phoneNumber).trim(),
        phoneE164: e164,
        kvkkAcceptedAt: new Date(),
        termsAcceptedAt: new Date(),
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
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPass = process.env.ADMIN_PASSWORD;
      const isAdminEmail =
        adminEmail && String(adminEmail).toLowerCase() === String(email).toLowerCase();

      // Defensive: ensure we have a usable password hash stored.
      const hasHash = !!user.password && typeof user.password === 'string';
      const looksLikeBcrypt = hasHash && /^\$2[aby]\$/.test(String(user.password));
      if (!hasHash || !looksLikeBcrypt) {
        // Auto-repair for platform admin if env vars exist (helps after historical bad data)
        if (isAdminEmail && adminPass) {
          const repairedHash = await bcrypt.hash(String(adminPass), 10);
          await user.update({ password: repairedHash });
        } else {
          // Do not leak details; treat like invalid credentials but with a clearer message.
          return res.status(401).json({ error: 'Şifre ayarlı değil veya geçersiz. Lütfen şifre sıfırlayın.' });
        }
      }

      let valid = false;
      try {
        valid = await bcrypt.compare(password, String(user.password));
      } catch (e) {
        // If bcrypt hash is malformed, allow auto-repair for platform admin.
        if (isAdminEmail && adminPass) {
          const repairedHash = await bcrypt.hash(String(adminPass), 10);
          await user.update({ password: repairedHash });
          valid = await bcrypt.compare(password, String(user.password));
        } else {
          return res.status(401).json({ error: 'Şifre geçersiz. Lütfen şifre sıfırlayın.' });
        }
      }
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

// POST /api/auth/forgot-password - create reset token; frontend sends email via EmailJS
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.json({ success: true });
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);
      await user.update({
        passwordResetToken: resetToken,
        passwordResetExpires: expires,
      });
      const baseUrl = req.protocol + '://' + req.get('host');
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
      res.json({ success: true, resetToken, resetLink, email: user.email });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/auth/reset-password - set new password with token
router.post(
  '/reset-password',
  [
    body('token').trim().notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const user = await db.User.findOne({
        where: {
          passwordResetToken: token,
        },
      });
      if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
        return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş link.' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      });
      res.json({ success: true });
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
