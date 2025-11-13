// models/Message.js - Message model for MongoDB

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  room: {
    type: String,
    default: 'general', // Default room name
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.isPrivate;
    },
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
}, {
  timestamps: true,
});

// Index for better query performance
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
