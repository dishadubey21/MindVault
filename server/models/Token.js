const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  // SHA-256 hashed refresh token string
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Document automatically purged when expiresAt date is reached
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Token', tokenSchema);
