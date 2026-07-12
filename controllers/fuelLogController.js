const fuelLogService = require('../services/fuelLogService');
const asyncHandler = require('../utils/asyncHandler');

const getAllFuelLogs = asyncHandler(async (req, res) => {
  const fuelLogs = await fuelLogService.getAllFuelLogs();
  res.status(200).json({ status: 'OK', data: fuelLogs });
});

const getFuelLogById = asyncHandler(async (req, res) => {
  const fuelLog = await fuelLogService.getFuelLogById(req.params.fuel_id);
  res.status(200).json({ status: 'OK', data: fuelLog });
});

const createFuelLog = asyncHandler(async (req, res) => {
  const fuelLog = await fuelLogService.createFuelLog(req.body);
  res.status(201).json({ status: 'OK', message: 'Fuel log created successfully', data: fuelLog });
});

const updateFuelLog = asyncHandler(async (req, res) => {
  const fuelLog = await fuelLogService.updateFuelLog(req.params.fuel_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Fuel log updated successfully', data: fuelLog });
});

const deleteFuelLog = asyncHandler(async (req, res) => {
  await fuelLogService.deleteFuelLog(req.params.fuel_id);
  res.status(200).json({ status: 'OK', message: 'Fuel log deleted successfully' });
});

module.exports = {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
