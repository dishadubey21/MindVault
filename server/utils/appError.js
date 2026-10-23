const ERROR_CODES = require('../constants/errorCodes');

/**
 * Centralized Operational Error Handler Model
 * Extends Node's native Error object to encapsulate HTTP codes, system-wide
 * identifier keys, and validation lists.
 */
class AppError extends Error {
  /**
   * @param {string} message - Descriptive error text
   * @param {number} statusCode - Target HTTP error status code (e.g., 400, 404, 401)
   * @param {string} [errorCode] - Matching key from server/constants/errorCodes.js
   * @param {Array} [errors] - Optional detailed validation items (for Joi schema reports)
   */
  constructor(message, statusCode, errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errorCode = errorCode;
    this.errors = errors;

    // Operational errors represent expected execution issues (e.g. invalid password, file size)
    // Non-operational errors represent system exceptions or programming bugs (e.g. database disconnect, undefined syntax)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
