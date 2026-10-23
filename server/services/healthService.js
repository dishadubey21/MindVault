const mongoose = require('mongoose');

/**
 * Health Check Service
 * Retrieves live database statuses and server runtime performance metrics.
 */
class HealthService {
  /**
   * Fetches overall backend system status
   * @returns {Object} System health telemetry statistics
   */
  getSystemHealth() {
    // readyState maps: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStateCodes = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const connectionState = mongoose.connection.readyState;
    const dbStatus = dbStateCodes[connectionState] || 'unknown';

    return {
      status: connectionState === 1 ? 'healthy' : 'unhealthy',
      database: {
        status: dbStatus,
        readyState: connectionState,
      },
      server: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

module.exports = new HealthService();
