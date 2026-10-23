const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');

/**
 * Express middleware for executing dynamic request object validations against Joi shapes.
 * 
 * @param {Object} schema - Joi schema definition
 * @param {string} [source="body"] - Request parameter target (body, params, query)
 * @returns {Function} Express middleware wrapper
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Extract all errors rather than failing on the first one
      stripUnknown: true, // Clean out fields that are not in schema
    });

    if (error) {
      // Map Joi validation reports to customized operational AppError format
      const validationErrors = error.details.map((item) => ({
        field: item.path.join('.'),
        message: item.message,
      }));
      
      const combinedMessage = validationErrors.map((e) => e.message).join(' ');

      return next(
        new AppError(
          combinedMessage,
          400,
          ERROR_CODES.VALIDATION_ERROR,
          validationErrors
        )
      );
    }

    // Overwrite the original payload with the cast/sanitized Joi parsed value
    req[source] = value;
    next();
  };
};

module.exports = validateRequest;
