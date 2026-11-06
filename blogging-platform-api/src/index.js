const express = require('express');
const cors = require('cors');
const config = require('./config');
const { migrate } = require('./db/migrate');
const postsRouter = require('./routes/posts');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

async function start() {
  await migrate();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', async (req, res) => {
    try {
      const pool = require('./db/pool');
      await pool.query('SELECT 1');
      res.status(200).json({ status: 'ok', database: 'up' });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'down' });
    }
  });

  app.use('/posts', postsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Blogging Platform API listening on http://localhost:${config.port}`);
    console.log('Try: GET /posts');
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
