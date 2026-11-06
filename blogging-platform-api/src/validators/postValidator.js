function validatePostBody(body) {
  const errors = [];

  if (typeof body.title !== 'string' || !body.title.trim()) {
    errors.push('title is required and must be a non-empty string');
  }

  if (typeof body.content !== 'string' || !body.content.trim()) {
    errors.push('content is required and must be a non-empty string');
  }

  if (typeof body.category !== 'string' || !body.category.trim()) {
    errors.push('category is required and must be a non-empty string');
  }

  if (!Array.isArray(body.tags)) {
    errors.push('tags is required and must be an array of strings');
  } else if (!body.tags.every((tag) => typeof tag === 'string')) {
    errors.push('tags must contain only strings');
  }

  if (errors.length > 0) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.code = 'ValidationError';
    err.details = errors;
    throw err;
  }

  return {
    title: body.title.trim(),
    content: body.content.trim(),
    category: body.category.trim(),
    tags: body.tags.map((tag) => tag.trim()).filter(Boolean),
  };
}

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Post id must be a positive integer');
    err.status = 400;
    err.code = 'ValidationError';
    throw err;
  }
  return id;
}

module.exports = { validatePostBody, parseId };
