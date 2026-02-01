// pg must be required explicitly for Vercel bundler (Sequelize dynamic require)
require('pg');

const app = require('../backend/app');

module.exports = (req, res) => {
  const orig = req.headers['x-vercel-original-url'] || req.headers['x-invoke-path'];
  if (orig) {
    const s = String(orig);
    // Keep query string; some endpoints rely on it (limit/page).
    // Also handle the case where the header contains a full URL.
    try {
      if (s.startsWith('http://') || s.startsWith('https://')) {
        const u = new URL(s);
        req.url = u.pathname + u.search;
      } else {
        req.url = s;
      }
    } catch {
      req.url = s;
    }
  }
  return app(req, res);
};
