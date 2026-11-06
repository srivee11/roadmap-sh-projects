function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: err.code || (status >= 500 ? 'Internal Server Error' : 'Request Error'),
    message: err.message || 'Internal Server Error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
