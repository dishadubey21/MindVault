const AppError = require('../utils/appError');
const ERROR_CODES = require('../constants/errorCodes');

// Memory map storing arrays of timestamps of failed auth attempts mapped by IP address
const failedAttempts = new Map();

/**
 * Middleware enforcing rate limits on authentication requests
 * Blocks access if IP registers 5 failed operations in a 15-minute rolling window.
 */
const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const timeframe = 15 * 60 * 1000; // 15 Minutes
  const maxAttempts = 5;

  if (!failedAttempts.has(ip)) {
    failedAttempts.set(ip, []);
  }

  // Filter out expired failed attempts older than the rolling window limit
  const recentAttempts = failedAttempts.get(ip).filter(timestamp => now - timestamp < timeframe);
  failedAttempts.set(ip, recentAttempts);

  if (recentAttempts.length >= maxAttempts) {
    return next(
      new AppError(
        'Too many failed attempts. Access temporarily locked. Please try again in 15 minutes.',
        429,
        ERROR_CODES.RATE_LIMIT_EXCEEDED
      )
    );
  }

  // Inject record helper onto request to log failed logins inside controller/service
  req.recordFailedAuthAttempt = () => {
    const list = failedAttempts.get(ip) || [];
    list.push(Date.now());
    failedAttempts.set(ip, list);
  };

  // Inject clear helper onto request to reset counter upon successful login
  req.clearFailedAuthAttempts = () => {
    failedAttempts.delete(ip);
  };

  next();
};

module.exports = {
  authRateLimiter,
};
