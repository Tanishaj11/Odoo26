const driverService = require('../services/driverService');
const asyncHandler = require('../utils/asyncHandler');

const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getAllDrivers();
  res.status(200).json({ status: 'OK', data: drivers });
});

const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.driver_id);
  res.status(200).json({ status: 'OK', data: driver });
});

const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  res.status(201).json({ status: 'OK', message: 'Driver created successfully', data: driver });
});

const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(req.params.driver_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Driver updated successfully', data: driver });
});

const deleteDriver = asyncHandler(async (req, res) => {
  await driverService.deleteDriver(req.params.driver_id);
  res.status(200).json({ status: 'OK', message: 'Driver deleted successfully' });
});

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
