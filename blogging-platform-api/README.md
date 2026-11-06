# Blogging Platform API

Beginner project from [roadmap.sh](https://roadmap.sh/projects/blogging-platform-api).

RESTful CRUD API for blog posts, backed by PostgreSQL, with optional search via `?term=`.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Server listens on `http://localhost:3001` by default (so it can run beside the weather API on 3000).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/posts` | Create a post (`201`) |
| `GET` | `/posts` | List all posts |
| `GET` | `/posts?term=tech` | Search title, content, or category |
| `GET` | `/posts/:id` | Get one post |
| `PUT` | `/posts/:id` | Replace a post |
| `DELETE` | `/posts/:id` | Delete a post (`204`) |
| `GET` | `/health` | DB health check |

### Create example

```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"My First Blog Post\",\"content\":\"This is the content of my first blog post.\",\"category\":\"Technology\",\"tags\":[\"Tech\",\"Programming\"]}"
```

### Search example

```bash
curl "http://localhost:3001/posts?term=tech"
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP port |
| `DATABASE_URL` | `postgresql://blog:blog@localhost:5433/blogging_platform` | Postgres connection string (host port 5433 to avoid local Postgres on 5432) |
