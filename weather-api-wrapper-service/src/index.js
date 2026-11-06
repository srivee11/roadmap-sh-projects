const express = require('express');
const cors = require('cors');
const config = require('./config');
const weatherRouter = require('./routes/weather');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { ping } = require('./services/cache');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  let redis = 'down';
  try {
    const pong = await ping();
    redis = pong === 'PONG' ? 'up' : 'down';
  } catch {
    redis = 'down';
  }

  const healthy = redis === 'up';
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    redis,
  });
});

app.use('/weather', weatherRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Weather API listening on http://localhost:${config.port}`);
  console.log(`Try: GET /weather/London`);
});

module.exports = app;
