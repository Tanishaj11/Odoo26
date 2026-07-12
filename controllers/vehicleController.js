const vehicleService = require('../services/vehicleService');
const asyncHandler = require('../utils/asyncHandler');

const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAllVehicles();
  res.status(200).json({ status: 'OK', data: vehicles });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.vehicle_id);
  res.status(200).json({ status: 'OK', data: vehicle });
});

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(201).json({ status: 'OK', message: 'Vehicle created successfully', data: vehicle });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.vehicle_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Vehicle updated successfully', data: vehicle });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.vehicle_id);
  res.status(200).json({ status: 'OK', message: 'Vehicle deleted successfully' });
});

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
