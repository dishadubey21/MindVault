const winston = require('winston');
const path = require('path');

// Custom plain-text formatting helper for development logs
const devLogFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Configure base logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Include stack trace if error instance
    winston.format.json() // Write logs as JSON in files
  ),
  transports: [
    // Error Logs File
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB size limit
      maxFiles: 5, // Keep up to 5 rotation files
    }),
    // Combined General Logs File
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB size limit
      maxFiles: 5,
    }),
  ],
});

// For development mode, attach colorized, structured console stream
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        devLogFormat
      ),
    })
  );
}

module.exports = logger;
