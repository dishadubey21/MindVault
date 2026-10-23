/**
 * Wraps asynchronous Express route handlers to automatically catch
 * rejection events and forward them to the global error middleware.
 * Eliminates boilerplates of repeating try/catch blocks inside controllers.
 * 
 * @param {Function} fn - Asynchronous Express route controller function
 * @returns {Function} Express route handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
