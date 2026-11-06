const pool = require('../db/pool');
const { validatePostBody, parseId } = require('../validators/postValidator');

function mapPost(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function notFound() {
  const err = new Error('Blog post not found');
  err.status = 404;
  err.code = 'NotFound';
  return err;
}

async function createPost(req, res, next) {
  try {
    const data = validatePostBody(req.body);
    const result = await pool.query(
      `INSERT INTO posts (title, content, category, tags)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.title, data.content, data.category, data.tags]
    );
    res.status(201).json(mapPost(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const data = validatePostBody(req.body);
    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           category = $3,
           tags = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [data.title, data.content, data.category, data.tags, id]
    );

    if (result.rowCount === 0) {
      throw notFound();
    }

    res.status(200).json(mapPost(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw notFound();
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw notFound();
    }

    res.status(200).json(mapPost(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

async function listPosts(req, res, next) {
  try {
    const term = typeof req.query.term === 'string' ? req.query.term.trim() : '';

    let result;
    if (term) {
      const pattern = `%${term}%`;
      result = await pool.query(
        `SELECT * FROM posts
         WHERE title ILIKE $1
            OR content ILIKE $1
            OR category ILIKE $1
         ORDER BY id ASC`,
        [pattern]
      );
    } else {
      result = await pool.query('SELECT * FROM posts ORDER BY id ASC');
    }

    res.status(200).json(result.rows.map(mapPost));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  listPosts,
};
