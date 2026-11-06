const axios = require('axios');
const config = require('../config');

const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

function createHttpError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

function mapWeatherResponse(data) {
  const current = data.currentConditions || (data.days && data.days[0]) || {};

  return {
    location: data.resolvedAddress || data.address,
    timezone: data.timezone,
    temperature: current.temp,
    feelsLike: current.feelslike,
    conditions: current.conditions,
    humidity: current.humidity,
    windSpeed: current.windspeed,
    windDirection: current.winddir,
    precipProbability: current.precipprob,
    uvIndex: current.uvindex,
    units: 'metric',
  };
}

async function fetchWeather(city) {
  if (!config.visualCrossingApiKey || config.visualCrossingApiKey.includes('your_api_key')) {
    throw createHttpError(
      500,
      'VISUAL_CROSSING_API_KEY is not configured. Copy .env.example to .env and add your key.',
      'ConfigError'
    );
  }

  const encodedCity = encodeURIComponent(city.trim());
  const url = `${BASE_URL}/${encodedCity}`;

  try {
    const response = await axios.get(url, {
      params: {
        unitGroup: 'metric',
        key: config.visualCrossingApiKey,
        contentType: 'json',
        include: 'current',
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    if (response.status === 400 || response.status === 404) {
      throw createHttpError(
        404,
        `City "${city}" was not found or is invalid`,
        'CityNotFound'
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw createHttpError(
        502,
        'Weather provider rejected the API key',
        'UpstreamAuthError'
      );
    }

    if (response.status === 429) {
      throw createHttpError(
        503,
        'Weather provider rate limit exceeded. Try again later.',
        'UpstreamRateLimit'
      );
    }

    if (response.status >= 400) {
      const detail =
        typeof response.data === 'string'
          ? response.data
          : response.data?.message || 'Unknown upstream error';
      throw createHttpError(502, `Weather provider error: ${detail}`, 'UpstreamError');
    }

    return mapWeatherResponse(response.data);
  } catch (err) {
    if (err.status) {
      throw err;
    }

    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw createHttpError(504, 'Weather provider timed out', 'UpstreamTimeout');
    }

    throw createHttpError(
      502,
      `Unable to reach weather provider: ${err.message}`,
      'UpstreamUnavailable'
    );
  }
}

module.exports = { fetchWeather, mapWeatherResponse };
