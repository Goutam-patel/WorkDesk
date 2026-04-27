const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/',
  validate([
    query('status').optional().isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('source').optional().isIn(['website', 'referral', 'linkedin', 'email', 'event', 'ads', 'other']),
    query('assignedTo').optional().isMongoId()
  ]),
  getLeads
);

router.post(
  '/',
  validate([
    body('title').trim().isLength({ min: 2, max: 140 }).withMessage('Title is required'),
    body('company').trim().isLength({ min: 2, max: 140 }).withMessage('Company is required'),
    body('contactName').optional().trim().isLength({ max: 120 }),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email must be valid').normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 40 }),
    body('website').optional().trim().isURL({ require_protocol: false }).withMessage('Website must be valid URL'),
    body('source').optional().isIn(['website', 'referral', 'linkedin', 'email', 'event', 'ads', 'other']),
    body('estimatedValue').optional().isFloat({ min: 0 }).withMessage('Estimated value must be 0 or more').toFloat(),
    body('notes').optional().trim().isLength({ max: 4000 }),
    body('status').optional().isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('assignedTo').optional({ nullable: true }).isMongoId()
  ]),
  createLead
);

router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Valid lead id is required'),
    body('title').optional().trim().isLength({ min: 2, max: 140 }),
    body('company').optional().trim().isLength({ min: 2, max: 140 }),
    body('contactName').optional().trim().isLength({ max: 120 }),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email must be valid').normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 40 }),
    body('website').optional().trim().isURL({ require_protocol: false }).withMessage('Website must be valid URL'),
    body('source').optional().isIn(['website', 'referral', 'linkedin', 'email', 'event', 'ads', 'other']),
    body('estimatedValue').optional().isFloat({ min: 0 }).withMessage('Estimated value must be 0 or more').toFloat(),
    body('notes').optional().trim().isLength({ max: 4000 }),
    body('status').optional().isIn(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('assignedTo').optional({ nullable: true }).isMongoId()
  ]),
  updateLead
);

router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Valid lead id is required')]),
  deleteLead
);

module.exports = router;
