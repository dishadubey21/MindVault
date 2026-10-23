const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Prevents leakage by default in query returns
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  subscriptionExpiry: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  themePreference: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  // Store only the SHA256 hashed versions of tokens in the database
  verificationTokenHash: {
    type: String,
    default: null,
  },
  verificationTokenExpiry: {
    type: Date,
    default: null,
  },
  resetPasswordTokenHash: {
    type: String,
    default: null,
  },
  resetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to hash passwords when modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compares a candidate password string with the database bcrypt password hash.
 * @param {string} candidatePassword - Password string to check
 * @param {string} hashPassword - Hashed password stored in DB
 * @returns {Promise<boolean>} True if match
 */
userSchema.methods.comparePassword = async function (candidatePassword, hashPassword) {
  return await bcrypt.compare(candidatePassword, hashPassword);
};

module.exports = mongoose.model('User', userSchema);
