const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly, platformAdminOnly } = require('../middleware/auth');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

const REQUIRED_DOC_KINDS = ['contractor_license', 'tax_certificate', 'trade_registry'];
const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_DOC_BYTES = 5 * 1024 * 1024; // 5MB

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

async function getMyMember(req) {
  return await db.Member.findOne({ where: { userId: req.user.id } });
}

async function requiredDocsApproved(memberId) {
  const docs = await db.MemberDocument.findAll({ where: { memberId } });
  const byKind = new Map();
  for (const d of docs) byKind.set(d.kind, d);
  for (const kind of REQUIRED_DOC_KINDS) {
    const doc = byKind.get(kind);
    if (!doc) return { ok: false, reason: `Eksik belge: ${kind}` };
    if (doc.status !== 'approved') return { ok: false, reason: `Belge onayı bekliyor: ${kind}` };
  }
  return { ok: true };
}

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

// Member: PATCH /api/members/me - update own profile (safe fields only)
router.patch(
  '/me',
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 255 }),
    body('company').optional({ nullable: true }).trim().isLength({ max: 255 }),
    body('role').optional({ nullable: true }).trim().isLength({ max: 255 }),
    body('profileImageUrl').optional({ nullable: true }).trim().isLength({ max: 500 }),
  ],
  validate,
  async (req, res) => {
    try {
      const member = await db.Member.findOne({ where: { userId: req.user.id } });
      if (!member) return res.status(404).json({ error: 'Member not found.' });

      const updates = {};
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.company !== undefined) updates.company = req.body.company || null;
      if (req.body.role !== undefined) updates.role = req.body.role || null;
      if (req.body.profileImageUrl !== undefined) updates.profileImageUrl = req.body.profileImageUrl || null;

      await member.update(updates);
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Member: GET /api/members/me/documents - list own docs (metadata only)
router.get('/me/documents', auth, async (req, res) => {
  try {
    const member = await getMyMember(req);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    const docs = await db.MemberDocument.findAll({
      where: { memberId: member.id },
      order: [['updatedAt', 'DESC'], ['id', 'DESC']],
      attributes: ['id', 'kind', 'filename', 'mimeType', 'sizeBytes', 'status', 'reviewerNote', 'createdAt', 'updatedAt'],
    });
    res.json({ requiredKinds: REQUIRED_DOC_KINDS, items: docs, verificationStatus: member.verificationStatus, verificationNote: member.verificationNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Member: POST /api/members/me/documents - upload/replace a document (base64)
router.post(
  '/me/documents',
  auth,
  [
    body('kind').trim().notEmpty().isLength({ max: 64 }),
    body('filename').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('mimeType').trim().notEmpty().isLength({ max: 100 }),
    body('base64').trim().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const member = await getMyMember(req);
      if (!member) return res.status(404).json({ error: 'Member not found.' });

      const kind = req.body.kind;
      if (!REQUIRED_DOC_KINDS.includes(kind)) {
        return res.status(400).json({ error: `Geçersiz belge türü. İzin verilenler: ${REQUIRED_DOC_KINDS.join(', ')}` });
      }
      const mimeType = req.body.mimeType;
      if (!ALLOWED_MIME.includes(mimeType)) {
        return res.status(400).json({ error: `Geçersiz dosya tipi. İzin verilenler: ${ALLOWED_MIME.join(', ')}` });
      }

      const base64 = String(req.body.base64).replace(/^data:.*;base64,/, '');
      const buf = Buffer.from(base64, 'base64');
      if (!buf || !buf.length) return res.status(400).json({ error: 'Dosya okunamadı.' });
      if (buf.length > MAX_DOC_BYTES) return res.status(400).json({ error: `Dosya çok büyük. Maksimum: ${Math.floor(MAX_DOC_BYTES / (1024 * 1024))}MB` });

      const filename = req.body.filename || `${kind}.${mimeType === 'application/pdf' ? 'pdf' : mimeType === 'image/png' ? 'png' : 'jpg'}`;

      const existing = await db.MemberDocument.findOne({ where: { memberId: member.id, kind } });
      if (!existing) {
        const created = await db.MemberDocument.create({
          memberId: member.id,
          kind,
          filename,
          mimeType,
          sizeBytes: buf.length,
          data: buf,
          status: 'uploaded',
          reviewerNote: null,
        });
        await member.update({ verificationStatus: 'under_review' });
        return res.status(201).json({ id: created.id, kind: created.kind, status: created.status });
      }

      await existing.update({
        filename,
        mimeType,
        sizeBytes: buf.length,
        data: buf,
        status: 'uploaded',
        reviewerNote: null,
      });
      await member.update({ verificationStatus: 'under_review' });
      res.json({ id: existing.id, kind: existing.kind, status: existing.status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Member/Admin: GET /api/members/documents/:docId/download - download doc
router.get('/documents/:docId/download', auth, [param('docId').isInt().toInt()], validate, async (req, res) => {
  try {
    const doc = await db.MemberDocument.findByPk(req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Document not found.' });
    const member = await db.Member.findByPk(doc.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found.' });

    // Access: owner or platform_admin
    const isOwner = member.userId && member.userId === req.user.id;
    const isPlatformAdmin = req.user.role === 'platform_admin';
    if (!isOwner && !isPlatformAdmin) return res.status(403).json({ error: 'Access denied.' });

    res.setHeader('Content-Type', doc.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${(doc.filename || 'document').replace(/"/g, '')}"`);
    res.send(doc.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform Admin: GET /api/members/:id/documents - list member docs
router.get('/:id/documents', auth, platformAdminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const member = await db.Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    const docs = await db.MemberDocument.findAll({
      where: { memberId: member.id },
      order: [['updatedAt', 'DESC'], ['id', 'DESC']],
      attributes: ['id', 'kind', 'filename', 'mimeType', 'sizeBytes', 'status', 'reviewerNote', 'createdAt', 'updatedAt'],
    });
    res.json({
      member: { id: member.id, name: member.name, email: member.email, isApproved: member.isApproved, verificationStatus: member.verificationStatus, verificationNote: member.verificationNote },
      requiredKinds: REQUIRED_DOC_KINDS,
      items: docs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform Admin: PATCH /api/members/:memberId/documents/:docId/review - approve/reject/resubmit
router.patch(
  '/:memberId/documents/:docId/review',
  auth,
  platformAdminOnly,
  [
    param('memberId').isInt().toInt(),
    param('docId').isInt().toInt(),
    body('status').trim().isIn(['approved', 'rejected', 'resubmit_required']),
    body('reviewerNote').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  ],
  validate,
  async (req, res) => {
    try {
      const member = await db.Member.findByPk(req.params.memberId);
      if (!member) return res.status(404).json({ error: 'Member not found.' });
      const doc = await db.MemberDocument.findByPk(req.params.docId);
      if (!doc || doc.memberId !== member.id) return res.status(404).json({ error: 'Document not found.' });

      await doc.update({
        status: req.body.status,
        reviewerNote: req.body.reviewerNote || null,
      });

      if (req.body.status === 'rejected' || req.body.status === 'resubmit_required') {
        await member.update({ verificationStatus: 'resubmit_required', isApproved: false });
      } else {
        await member.update({ verificationStatus: 'under_review', isApproved: false });
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: request resubmission (member-level)
router.patch(
  '/:id/request-resubmission',
  auth,
  platformAdminOnly,
  [param('id').isInt().toInt(), body('verificationNote').optional({ checkFalsy: true }).trim().isLength({ max: 2000 })],
  validate,
  async (req, res) => {
    try {
      const member = await db.Member.findByPk(req.params.id);
      if (!member) return res.status(404).json({ error: 'Member not found.' });
      await member.update({ verificationStatus: 'resubmit_required', isApproved: false, verificationNote: req.body.verificationNote || null });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: reject member
router.patch(
  '/:id/reject',
  auth,
  platformAdminOnly,
  [param('id').isInt().toInt(), body('verificationNote').optional({ checkFalsy: true }).trim().isLength({ max: 2000 })],
  validate,
  async (req, res) => {
    try {
      const member = await db.Member.findByPk(req.params.id);
      if (!member) return res.status(404).json({ error: 'Member not found.' });
      await member.update({ verificationStatus: 'rejected', isApproved: false, verificationNote: req.body.verificationNote || null });
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
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

// Admin: PUT member (isApproved sadece platform_admin değiştirebilir)
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
      const updates = {
        ...(req.body.name !== undefined && { name: req.body.name }),
        ...(req.body.email !== undefined && { email: req.body.email }),
        ...(req.body.company !== undefined && { company: req.body.company }),
        ...(req.body.role !== undefined && { role: req.body.role }),
        ...(req.body.profileImageUrl !== undefined && { profileImageUrl: req.body.profileImageUrl }),
        ...(req.body.joinDate !== undefined && { joinDate: req.body.joinDate }),
      };
      if (req.body.isApproved !== undefined && req.user.role === 'platform_admin') {
        updates.isApproved = req.body.isApproved;
      }
      await member.update(updates);
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: Üye onayla (hızlı onay için)
router.patch('/:id/approve', auth, platformAdminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const member = await db.Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    const check = await requiredDocsApproved(member.id);
    if (!check.ok) return res.status(400).json({ error: check.reason || 'Belgeler onaylanmadan üye onaylanamaz.' });
    await member.update({ isApproved: true, verificationStatus: 'approved', verificationNote: null });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE member
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const member = await db.Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    const st = String(member.verificationStatus || '');
    // Silme: red / belge tekrarı / onay verilmeden aktif olmamalı
    if (st === 'pending_docs' || st === 'under_review') {
      return res.status(400).json({ error: 'Üye bu aşamada silinemez. Önce onay/red/belge tekrarı işlemi yapılmalı.' });
    }
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
