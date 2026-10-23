const healthService = require('../services/healthService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Health Controller
 * Orchestrates health telemetry checks.
 */
const getHealthStatus = asyncHandler(async (req, res) => {
  const healthData = healthService.getSystemHealth();
  const statusCode = healthData.status === 'healthy' ? 200 : 503;

  return new ApiResponse(
    statusCode,
    'MindVault System telemetry check succeeded.',
    healthData
  ).send(res);
});

module.exports = {
  getHealthStatus,
};
