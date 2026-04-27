const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'agent'],
      default: 'agent'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
