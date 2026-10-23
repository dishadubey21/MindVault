const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Initiates connection to MongoDB database via Mongoose
 * and registers connection health event handlers.
 */
const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    logger.error('Database connection failed: MONGODB_URI is undefined inside environment config.');
    process.exit(1);
  }

  // Setup mongoose settings if needed
  mongoose.set('strictQuery', true);

  try {
    const connectionInstance = await mongoose.connect(dbUri);
    logger.info(`MongoDB connection established successfully on host: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB initialization failure: ${error.message}`);
    // Delay exit to allow Winston logs to write to disk in production
    setTimeout(() => process.exit(1), 1000);
  }
};

// Monitor runtime database connection changes
mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose database connection lost.');
});

mongoose.connection.on('reconnected', () => {
  logger.info('Mongoose database connection re-established.');
});

// Capture termination signals to cleanly disconnect db
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    logger.info(`Mongoose connection closed cleanly due to process signal (${signal}).`);
    process.exit(0);
  } catch (err) {
    logger.error(`Error during Mongoose connection closure: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = connectDB;
