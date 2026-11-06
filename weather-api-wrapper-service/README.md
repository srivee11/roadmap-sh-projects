# Weather API Wrapper Service

Beginner project from [roadmap.sh](https://roadmap.sh/projects/weather-api-wrapper-service).

Wraps [Visual Crossing](https://www.visualcrossing.com/weather-api) behind a simple Express API, with Redis caching (12h TTL), environment-based secrets, error handling, and rate limiting.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Free [Visual Crossing API key](https://www.visualcrossing.com/sign-up)

## Setup

```bash
# from this folder
cp .env.example .env
# edit .env and set VISUAL_CROSSING_API_KEY

docker compose up -d
npm install
npm run dev
```

Server listens on `http://localhost:3000` by default.

## Endpoints

### `GET /health`

Redis connectivity check.

```json
{ "status": "ok", "redis": "up" }
```

### `GET /weather/:city`

Example: `GET /weather/London`

```json
{
  "location": "London, England, United Kingdom",
  "timezone": "Europe/London",
  "temperature": 12.3,
  "feelsLike": 11.1,
  "conditions": "Partially cloudy",
  "humidity": 78,
  "windSpeed": 15.2,
  "windDirection": 240,
  "precipProbability": 10,
  "uvIndex": 2,
  "units": "metric",
  "cached": false
}
```

A second request for the same city within 12 hours returns `"cached": true` without calling Visual Crossing again.

### Rate limiting

Default: **30 requests per 15 minutes** per IP on `/weather/*` (configurable via env).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `VISUAL_CROSSING_API_KEY` | — | Required API key |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `CACHE_TTL_SECONDS` | `43200` | Cache TTL (12 hours) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate-limit window |
| `RATE_LIMIT_MAX` | `30` | Max requests per window |

## Manual check

```bash
curl http://localhost:3000/health
curl http://localhost:3000/weather/London
curl http://localhost:3000/weather/London   # should show "cached": true
```
