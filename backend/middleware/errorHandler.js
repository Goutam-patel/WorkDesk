const { logger } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    message = 'Validation failed';
  }

  if (err.name === 'CastError') {
    message = 'Invalid resource identifier';
  }

  if (err.code === 11000) {
    message = 'Duplicate field value';
  }

  logger.error(`${req.method} ${req.originalUrl} -> ${statusCode}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
