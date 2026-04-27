const cors = require('cors');

const allowedOrigins = new Set(
  (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    'http://localhost:3000,http://127.0.0.1:3000'
  )
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.protocol === 'https:' && parsedOrigin.hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
module.exports.corsOptions = corsOptions;
module.exports.isAllowedOrigin = isAllowedOrigin;
