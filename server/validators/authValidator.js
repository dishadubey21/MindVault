const Joi = require('joi');
const { REGEX } = require('../constants');

// 1. User Registration Schema
const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(REGEX.USERNAME)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores (3-30 characters).',
      'any.required': 'Username is required.',
    }),
  email: Joi.string()
    .pattern(REGEX.EMAIL)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),
});

// 2. User Login Schema
const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(REGEX.EMAIL)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required.',
    }),
});

// 3. Password Request Schema (Forgot Password)
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(REGEX.EMAIL)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
});

// 4. Password Override Schema (Reset Password)
const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),
  token: Joi.string().optional(),
});

// 5. Verify Email Schema
const verifyEmailSchema = Joi.object({
  token: Joi.string().optional(),
});

// 6. Account Password Modification Schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required.',
    }),
  newPassword: Joi.string()
    .pattern(REGEX.PASSWORD)
    .required()
    .messages({
      'string.pattern.base': 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'New password is required.',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
};
