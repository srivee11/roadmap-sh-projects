const express = require('express');
const { getCachedWeather, setCachedWeather } = require('../services/cache');
const { fetchWeather } = require('../services/visualCrossing');
const { weatherRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/:city', weatherRateLimiter, async (req, res, next) => {
  try {
    const city = req.params.city;

    if (!city || !city.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'City parameter is required',
      });
    }

    let cached = null;
    let cacheWarning;

    try {
      cached = await getCachedWeather(city);
    } catch (cacheErr) {
      console.error('Redis get failed:', cacheErr.message);
      cacheWarning = 'Redis unavailable';
    }

    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const weather = await fetchWeather(city);

    try {
      await setCachedWeather(city, weather);
    } catch (cacheErr) {
      console.error('Redis set failed:', cacheErr.message);
      cacheWarning = 'Redis unavailable';
    }

    const payload = { ...weather, cached: false };
    if (cacheWarning) {
      payload.cacheWarning = cacheWarning;
    }

    return res.json(payload);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
