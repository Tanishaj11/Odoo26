const healthService = require('../services/healthService');
const asyncHandler = require('../utils/asyncHandler');

const getHealth = asyncHandler(async (req, res) => {
  try {
    await healthService.checkDatabaseConnection();

    res.status(200).json({
      status: 'OK',
      database: 'Connected',
    });
  } catch {
    res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
    });
  }
});

module.exports = {
  getHealth,
};
