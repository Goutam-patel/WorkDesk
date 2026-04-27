const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { register, login, refresh, logout, me } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  validate([
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    body('rememberMe').optional().isBoolean().withMessage('Remember me must be a boolean')
  ]),
  login
);

router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', authMiddleware, me);

module.exports = router;
