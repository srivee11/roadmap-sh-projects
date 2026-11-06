require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  visualCrossingApiKey: process.env.VISUAL_CROSSING_API_KEY || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 43200, // 12 hours
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 30,
};

if (!config.visualCrossingApiKey || config.visualCrossingApiKey.includes('your_api_key')) {
  console.warn(
    'Warning: VISUAL_CROSSING_API_KEY is not set. GET /weather will fail until you add a key to .env'
  );
}

module.exports = config;
