// Load environment variables early before other imports
require('dotenv').config();

const logger = require('./utils/logger');
const connectDB = require('./config/db.js');
const app = require('./app');

// Handle Uncaught Exceptions (synchronous runtime failures)
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL UNCAUGHT EXCEPTION! Initiating immediate shutdown...', err);
  // Delay exit slightly to write log cache to disk
  setTimeout(() => process.exit(1), 1000);
});

const PORT = process.env.PORT || 5000;

// Initialize Database connection and launch HTTP server
const startServer = async () => {
  // Connect to MongoDB Database
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`MindVault server listening on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  });

  // Handle Unhandled Rejections (asynchronous promise failures)
  process.on('unhandledRejection', (err) => {
    logger.error('CRITICAL UNHANDLED REJECTION! Shutting down server gracefully...', err);
    server.close(() => {
      setTimeout(() => process.exit(1), 1000);
    });
  });
};

startServer();
