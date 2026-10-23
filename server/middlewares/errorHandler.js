const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');

// Mongoose / MongoDB Error Sanitisers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400, ERROR_CODES.VALIDATION_ERROR);
};

const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate field value enclosed in quotes or keys
  const match = err.message.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 409, ERROR_CODES.CONFLICT);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = 'Invalid input data.';
  return new AppError(message, 400, ERROR_CODES.VALIDATION_ERROR, errors);
};

// Joi Request payload Validation Error Sanitiser
const handleJoiValidationError = (err) => {
  const errors = err.details.map((el) => ({
    field: el.path.join('.'),
    message: el.message,
  }));
  const message = 'Validation failed.';
  return new AppError(message, 400, ERROR_CODES.VALIDATION_ERROR, errors);
};

// JWT Validation Errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401, ERROR_CODES.UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new AppError('Your session has expired. Please log in again.', 401, ERROR_CODES.TOKEN_EXPIRED);
};

// Response sender in Development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    message: err.message,
    errors: err.errors || [],
    error: err,
    stack: err.stack,
  });
};

// Response sender in Production mode
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send back clean information to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Programming or unknown package crash: do not leak infrastructure details
  logger.error('CRITICAL UNHANDLED ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    statusCode: 500,
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: 'An internal server error occurred.',
    errors: [],
  });
};

/**
 * Express Global Error Handling Middleware
 */
module.exports = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;

  // Log error summary with appropriate level via Winston
  if (err.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - [${err.statusCode}]: ${err.message}`);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone error object to safely overwrite values
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;
    error.stack = err.stack;

    // Map common third-party schema exceptions to operational AppErrors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.isJoi) error = handleJoiValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
