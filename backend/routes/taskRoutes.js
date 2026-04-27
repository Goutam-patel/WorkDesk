const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/',
  validate([
    query('status').optional().isIn(['todo', 'in_progress', 'blocked', 'completed']),
    query('leadId').optional().isMongoId(),
    query('assignedTo').optional().isMongoId()
  ]),
  getTasks
);

router.post(
  '/',
  validate([
    body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Title is required'),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['todo', 'in_progress', 'blocked', 'completed']),
    body('leadId').optional({ nullable: true }).isMongoId(),
    body('assignedTo').optional({ nullable: true }).isMongoId(),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate()
  ]),
  createTask
);

router.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Valid task id is required'),
    body('title').optional().trim().isLength({ min: 2, max: 160 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['todo', 'in_progress', 'blocked', 'completed']),
    body('leadId').optional({ nullable: true }).isMongoId(),
    body('assignedTo').optional({ nullable: true }).isMongoId(),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate()
  ]),
  updateTask
);

router.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Valid task id is required')]),
  deleteTask
);

module.exports = router;
