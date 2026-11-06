const Redis = require('ioredis');
const config = require('../config');

const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

function cacheKey(city) {
  return `weather:${city.trim().toLowerCase()}`;
}

async function connect() {
  if (redis.status === 'wait' || redis.status === 'end') {
    await redis.connect();
  }
}

async function getCachedWeather(city) {
  await connect();
  const raw = await redis.get(cacheKey(city));
  if (!raw) {
    return null;
  }
  return JSON.parse(raw);
}

async function setCachedWeather(city, data) {
  await connect();
  await redis.set(cacheKey(city), JSON.stringify(data), 'EX', config.cacheTtlSeconds);
}

async function ping() {
  await connect();
  return redis.ping();
}

module.exports = {
  getCachedWeather,
  setCachedWeather,
  ping,
  redis,
};
