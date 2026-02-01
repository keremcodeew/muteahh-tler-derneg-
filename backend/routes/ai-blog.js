const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, platformAdminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 140);
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

async function callGeminiJson({ title, language, tone, maxWords, keywords }) {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_STUDIO_API_KEY (or GEMINI_API_KEY) must be set.');

  const prompt = {
    title,
    language: language || 'tr',
    tone: tone || 'kurumsal, bilgilendirici',
    maxWords: maxWords || 900,
    keywords: Array.isArray(keywords) ? keywords : [],
  };

  const sys = `You are an expert Turkish corporate content writer. Write original content. No plagiarism.
Return STRICT JSON only, with keys: title, excerpt, contentMarkdown, coverImageUrl (optional), tags (array of strings).`;

  const user = `Write a blog post based on this topic. Use headings and bullet lists where appropriate.
Topic: ${prompt.title}
Language: ${prompt.language}
Tone: ${prompt.tone}
Target length: <= ${prompt.maxWords} words
Keywords (optional): ${(prompt.keywords || []).join(', ')}

Output JSON only.`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.error?.message || data.error || data.message)) ||
      `Gemini error: ${res.status}`;
    throw new Error(msg);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = safeJsonParse(text);
  if (!parsed || !parsed.contentMarkdown) throw new Error('AI output parse failed.');
  return parsed;
}

async function runDueTasks({ max = 5 } = {}) {
  const now = new Date();
  const tasks = await db.AiBlogTask.findAll({
    where: { status: 'scheduled', publishAt: { [Op.lte]: now } },
    order: [['publishAt', 'ASC'], ['id', 'ASC']],
    limit: max,
  });

  const results = [];
  for (const task of tasks) {
    try {
      await task.update({ status: 'running', startedAt: new Date(), lastError: null });
      const settings = safeJsonParse(task.settingsJson || '') || {};
      const ai = await callGeminiJson({
        title: task.title,
        language: settings.language || 'tr',
        tone: settings.tone || 'kurumsal',
        maxWords: settings.maxWords || 900,
        keywords: settings.keywords || [],
      });

      const publishDate = new Date().toISOString().split('T')[0];
      const base = slugify(ai.title || task.title);
      let slug = base || `post-${Date.now()}`;
      let n = 1;
      while (await db.BlogPost.findOne({ where: { slug } })) {
        n += 1;
        slug = `${base}-${n}`;
      }

      const post = await db.BlogPost.create({
        title: ai.title || task.title,
        slug,
        excerpt: ai.excerpt || String(ai.contentMarkdown).slice(0, 220),
        content: ai.contentMarkdown,
        coverImageUrl: ai.coverImageUrl || settings.coverImageUrl || null,
        publishDate,
        isPublished: true,
        author: 'AI',
        source: 'ai',
      });

      await task.update({
        status: 'published',
        finishedAt: new Date(),
        generatedPostId: post.id,
      });

      results.push({ taskId: task.id, postId: post.id, ok: true });
    } catch (err) {
      await task.update({
        status: 'failed',
        finishedAt: new Date(),
        lastError: String(err?.message || err),
      });
      results.push({ taskId: task.id, ok: false, error: String(err?.message || err) });
    }
  }

  return results;
}

// Platform Admin: create a scheduled task
router.post(
  '/tasks',
  auth,
  platformAdminOnly,
  [
    body('title').trim().notEmpty().isLength({ max: 500 }),
    body('publishAt').trim().notEmpty(),
    body('settings').optional(),
  ],
  validate,
  async (req, res) => {
    try {
      const dt = new Date(req.body.publishAt);
      if (isNaN(dt.getTime())) return res.status(400).json({ error: 'Geçersiz tarih/saat.' });
      const settingsJson = req.body.settings ? JSON.stringify(req.body.settings) : null;
      const task = await db.AiBlogTask.create({
        title: req.body.title,
        publishAt: dt,
        status: 'scheduled',
        settingsJson,
      });
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: list tasks
router.get('/tasks/admin/all', auth, platformAdminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 200;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.AiBlogTask.findAndCountAll({
      order: [['publishAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform Admin: delete task
router.delete('/tasks/:id', auth, platformAdminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const task = await db.AiBlogTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    await task.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cron: run due tasks (Vercel Cron or external)
router.post('/run-due', [query('max').optional().isInt({ min: 1, max: 20 }).toInt()], validate, async (req, res) => {
  try {
    const cronHeader = String(req.headers['x-vercel-cron'] || '');
    const secret = String(req.headers['x-cron-secret'] || req.query.secret || '');
    const envSecret = process.env.CRON_SECRET;
    const allowedBySecret = envSecret ? secret && secret === envSecret : false;
    const allowedByVercelCron = cronHeader === '1';
    if (!allowedBySecret && !allowedByVercelCron) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    const max = req.query.max || 5;
    const results = await runDueTasks({ max });
    res.json({ ok: true, processed: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform Admin: run now (manual)
router.post('/run-now', auth, platformAdminOnly, [query('max').optional().isInt({ min: 1, max: 20 }).toInt()], validate, async (req, res) => {
  try {
    const max = req.query.max || 5;
    const results = await runDueTasks({ max });
    res.json({ ok: true, processed: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

