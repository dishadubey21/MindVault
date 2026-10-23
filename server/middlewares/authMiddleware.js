const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');
const logger = require('../utils/logger');

/**
 * Authentication Route Guard Middleware
 * Decrypts access tokens, checks validity, and queries active database profile records.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract Access Token from HTTP headers
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in. Please log in to access this resource.',
        401,
        ERROR_CODES.UNAUTHORIZED
      )
    );
  }

  try {
    // Decrypt the token payload
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch matching user document
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this session token no longer exists.',
          401,
          ERROR_CODES.UNAUTHORIZED
        )
      );
    }

    // Attach active user context onto request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new AppError(
          'Your login session token has expired. Please refresh your session.',
          401,
          ERROR_CODES.TOKEN_EXPIRED
        )
      );
    }
    
    logger.warn(`JWT authorization check failure: ${error.message}`);
    return next(
      new AppError(
        'Invalid session token signature.',
        401,
        ERROR_CODES.UNAUTHORIZED
      )
    );
  }
};

module.exports = protect;
