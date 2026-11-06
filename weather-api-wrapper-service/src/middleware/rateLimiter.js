const rateLimit = require('express-rate-limit');
const config = require('../config');

const weatherRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: `Rate limit exceeded. Try again after ${Math.ceil(config.rateLimitWindowMs / 60000)} minutes.`,
  },
});

module.exports = { weatherRateLimiter };
