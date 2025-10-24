const rateLimit = require('express-rate-limit');
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  message: { error: 'Too many requests', retryAfter: '15 minutes' },
  standardHeaders: true, legacyHeaders: false
});
module.exports = { globalLimiter };
