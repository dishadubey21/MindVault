/**
 * Centralized Backend Constants
 */

const ERROR_CODES = require('./errorCodes');

const ROLES = {
  FREE: 'free',
  PREMIUM: 'premium',
};

const REGEX = {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character (any standard symbol)
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  EMAIL: /^\S+@\S+\.\S+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
};

const LIMITS = {
  FREE_IMAGE_UPLOAD_LIMIT_24H: 1,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_DOC_SIZE_BYTES: 10 * 1024 * 1024,  // 10MB
  NOTE_TITLE_MAX_LENGTH: 100,
  PAGINATION_DEFAULT_PAGE: 1,
  PAGINATION_DEFAULT_LIMIT: 10,
  PAGINATION_MAX_LIMIT: 50,
};

const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful. Please verify your email.',
    LOGIN_SUCCESS: 'Login successful.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    EMAIL_VERIFIED: 'Email verified successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully.',
    ACCOUNT_DELETED: 'Account and all associated records permanently deleted.',
  },
  NOTES: {
    CREATED: 'Note created successfully.',
    UPDATED: 'Note updated successfully.',
    DELETED: 'Note moved to trash.',
    RESTORED: 'Note restored from trash.',
    PERMANENTLY_DELETED: 'Note and associated files permanently deleted.',
    NOT_FOUND: 'Note not found.',
  },
  PAYMENT: {
    ORDER_CREATED: 'Payment order created successfully.',
    VERIFICATION_SUCCESS: 'Payment verified and account upgraded to Premium.',
    VERIFICATION_FAILED: 'Payment signature verification failed.',
  },
  ERRORS: {
    INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
    UNAUTHORIZED: 'You must be logged in to access this resource.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
    IMAGE_LIMIT_EXCEEDED: 'Free users are restricted to 1 image upload every rolling 24 hours. Upgrade to Premium for unlimited image uploads.',
  },
};

module.exports = {
  ERROR_CODES,
  ROLES,
  REGEX,
  LIMITS,
  MESSAGES,
};
