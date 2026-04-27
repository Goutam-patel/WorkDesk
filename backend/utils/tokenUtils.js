const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return secret;
}

function getRefreshJwtSecret() {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
}

function generateAccessToken(payload, options = {}) {
  const secret = getJwtSecret();
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || '15m';

  return jwt.sign(payload, secret, { expiresIn });
}

function generateRefreshToken(payload, options = {}) {
  const secret = getRefreshJwtSecret();
  const expiresIn = options.expiresIn || process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
}

function verifyAccessToken(token) {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
}

function verifyRefreshToken(token) {
  const secret = getRefreshJwtSecret();
  return jwt.verify(token, secret);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateSessionId() {
  return crypto.randomUUID();
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  generateSessionId
};
