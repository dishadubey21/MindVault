const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');

/**
 * Email Verification Guard Middleware
 * Ensures user has verified their email address before accessing specific endpoints.
 * Must be registered AFTER the protect auth middleware.
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError(
        'User context not loaded. Protect middleware must execute first.',
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR
      )
    );
  }

  if (!req.user.isVerified) {
    return next(
      new AppError(
        'Your email address is unverified. Please verify your account to unlock this action.',
        403,
        ERROR_CODES.FORBIDDEN
      )
    );
  }

  next();
};

module.exports = requireVerified;
