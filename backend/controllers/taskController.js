const Task = require('../models/Task');

const allowedTransitions = {
  todo: ['in_progress', 'blocked', 'completed'],
  in_progress: ['todo', 'blocked', 'completed'],
  blocked: ['todo', 'in_progress'],
  completed: ['in_progress']
};

function isStatusTransitionAllowed(currentStatus, nextStatus) {
  if (!nextStatus || currentStatus === nextStatus) {
    return true;
  }

  return (allowedTransitions[currentStatus] || []).includes(nextStatus);
}

async function createTask(req, res, next) {
  try {
    const payload = req.validated || req.body;

    const task = await Task.create({
      ...payload,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    return next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const filters = req.validated || req.query;
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.leadId) query.leadId = filters.leadId;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;

    const tasks = await Task.find(query)
      .populate('leadId', 'title status')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const payload = req.validated || req.body;
    const taskId = payload.id || req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (payload.status && !isStatusTransitionAllowed(task.status, payload.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${task.status} to ${payload.status}`
      });
    }

    const fields = ['title', 'description', 'status', 'leadId', 'assignedTo', 'dueDate'];
    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        task[field] = payload[field];
      }
    });

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const taskId = (req.validated && req.validated.id) || req.params.id;

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
