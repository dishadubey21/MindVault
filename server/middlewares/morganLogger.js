const morgan = require('morgan');
const logger = require('../utils/logger');

// Custom formatter structure for Morgan requests
const formatString = process.env.NODE_ENV === 'production' 
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  : 'dev'; // Colorized simple method status url millisecond logging

// Pipe morgan's standard stdout streams to Winston info logger
const stream = {
  write: (message) => logger.info(message.trim()),
};

const morganLogger = morgan(formatString, { stream });

module.exports = morganLogger;
