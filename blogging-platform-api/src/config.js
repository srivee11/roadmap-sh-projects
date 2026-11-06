require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://blog:blog@localhost:5433/blogging_platform',
};

module.exports = config;
