const app = require('../backend/app');

module.exports = (req, res) => {
  const orig = req.headers['x-vercel-original-url'] || req.headers['x-invoke-path'];
  if (orig) req.url = orig.split('?')[0];
  return app(req, res);
};
