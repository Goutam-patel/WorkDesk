const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    contactName: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      maxlength: 160
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      maxlength: 40
    },
    website: {
      type: String,
      default: '',
      trim: true,
      maxlength: 240
    },
    source: {
      type: String,
      enum: ['website', 'referral', 'linkedin', 'email', 'event', 'ads', 'other'],
      default: 'other'
    },
    estimatedValue: {
      type: Number,
      min: 0,
      default: 0
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 4000
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
      default: 'new'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lead', leadSchema);
