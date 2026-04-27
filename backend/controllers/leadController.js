const Lead = require('../models/Lead');

async function createLead(req, res, next) {
  try {
    const payload = req.validated || req.body;

    const lead = await Lead.create({
      ...payload,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    return next(error);
  }
}

async function getLeads(req, res, next) {
  try {
    const filters = req.validated || req.query;
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.source) query.source = filters.source;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    return next(error);
  }
}

async function updateLead(req, res, next) {
  try {
    const payload = req.validated || req.body;
    const leadId = payload.id || req.params.id;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const fields = [
      'title',
      'company',
      'contactName',
      'email',
      'phone',
      'website',
      'source',
      'estimatedValue',
      'notes',
      'status',
      'priority',
      'assignedTo'
    ];
    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        lead[field] = payload[field];
      }
    });

    await lead.save();

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteLead(req, res, next) {
  try {
    const leadId = (req.validated && req.validated.id) || req.params.id;

    const lead = await Lead.findByIdAndDelete(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead
};
