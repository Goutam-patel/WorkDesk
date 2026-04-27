const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateSessionId
} = require('../utils/tokenUtils');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const REFRESH_COOKIE_NAME = 'workdesk_rt';

function isSecureCrossSiteDeployment() {
  const deploymentOrigins = [process.env.FRONTEND_URL, process.env.CORS_ORIGIN, process.env.CLIENT_URL]
    .filter(Boolean)
    .map((origin) => origin.trim().toLowerCase());

  return deploymentOrigins.some((origin) => origin.startsWith('https://') && !origin.includes('localhost'));
}

function toBoolean(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }

  return null;
}

function resolveCookiePolicy() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isCrossSiteDeployment = isSecureCrossSiteDeployment();
  const allowedSameSite = ['strict', 'lax', 'none'];
  const envSameSite = (process.env.COOKIE_SAME_SITE || '').trim().toLowerCase();
  const sameSite = allowedSameSite.includes(envSameSite)
    ? envSameSite
    : isCrossSiteDeployment || isProduction
      ? 'none'
      : 'lax';
  const secureOverride = toBoolean(process.env.COOKIE_SECURE);
  const secure = secureOverride === null ? isCrossSiteDeployment || isProduction : secureOverride;

  return {
    sameSite,
    secure: sameSite === 'none' ? true : secure
  };
}

function getRefreshTtlMs(rememberMe) {
  if (rememberMe) {
    return 1000 * 60 * 60 * 24 * 30;
  }
  return 1000 * 60 * 60 * 24 * 7;
}

function getCookieOptions(maxAge) {
  const cookiePolicy = resolveCookiePolicy();

  return {
    httpOnly: true,
    secure: cookiePolicy.secure,
    sameSite: cookiePolicy.sameSite,
    path: '/',
    maxAge
  };
}

function clearRefreshCookie(res) {
  const cookiePolicy = resolveCookiePolicy();

  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: cookiePolicy.secure,
    sameSite: cookiePolicy.sameSite,
    path: '/'
  });
}

function getRequestMeta(req) {
  return {
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip || req.connection?.remoteAddress || ''
  };
}

async function createSessionTokens(user, req, rememberMe = false, existingSessionId = null) {
  const sessionId = existingSessionId || generateSessionId();
  const refreshTtlMs = getRefreshTtlMs(Boolean(rememberMe));
  const refreshToken = generateRefreshToken(
    { id: user._id, sid: sessionId },
    { expiresIn: rememberMe ? '30d' : '7d' }
  );
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    sessionId,
    rememberMe: Boolean(rememberMe),
    expiresAt: new Date(Date.now() + refreshTtlMs),
    ...getRequestMeta(req)
  });

  return {
    accessToken,
    refreshToken,
    refreshTtlMs,
    tokenHash,
    sessionId
  };
}

function sendAuthSuccess(res, user, tokens) {
  res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions(tokens.refreshTtlMs));
  return res.status(200).json({
    success: true,
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    user: toSafeUser(user)
  });
}

function toSafeUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.validated || req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'agent'
    });

    const tokens = await createSessionTokens(user, req, true);

    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions(tokens.refreshTtlMs));
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      user: toSafeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.validated || req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const tokens = await createSessionTokens(user, req, Boolean(rememberMe));

    return sendAuthSuccess(res, user, tokens);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (error) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const incomingHash = hashToken(incomingRefreshToken);
    const session = await RefreshToken.findOne({ tokenHash: incomingHash });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh session has expired'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      await RefreshToken.findByIdAndDelete(session._id);
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: 'User not found for this session'
      });
    }

    const tokens = await createSessionTokens(user, req, session.rememberMe, session.sessionId);
    session.revokedAt = new Date();
    session.replacedByTokenHash = tokens.tokenHash;
    await session.save();

    return sendAuthSuccess(res, user, tokens);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (incomingRefreshToken) {
      const incomingHash = hashToken(incomingRefreshToken);
      await RefreshToken.findOneAndUpdate(
        { tokenHash: incomingHash, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    }

    clearRefreshCookie(res);
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.status(200).json({
    success: true,
    user: toSafeUser(req.user)
  });
}

async function debugCookies(req, res) {
  // Expose cookies and some request metadata for debugging only when enabled via env
  if (process.env.DEBUG_COOKIE !== 'true') {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  return res.status(200).json({
    success: true,
    cookies: req.cookies || {},
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      host: req.headers.host
    }
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  debugCookies
};
