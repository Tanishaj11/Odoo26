const maintenanceService = require('../services/maintenanceService');
const asyncHandler = require('../utils/asyncHandler');

const getAllMaintenanceRecords = asyncHandler(async (req, res) => {
  const records = await maintenanceService.getAllMaintenanceRecords();
  res.status(200).json({ status: 'OK', data: records });
});

const getMaintenanceById = asyncHandler(async (req, res) => {
  const record = await maintenanceService.getMaintenanceById(req.params.maintenance_id);
  res.status(200).json({ status: 'OK', data: record });
});

const createMaintenance = asyncHandler(async (req, res) => {
  const record = await maintenanceService.createMaintenance(req.body);
  res.status(201).json({ status: 'OK', message: 'Maintenance record created successfully', data: record });
});

const updateMaintenance = asyncHandler(async (req, res) => {
  const record = await maintenanceService.updateMaintenance(req.params.maintenance_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Maintenance record updated successfully', data: record });
});

const startMaintenance = asyncHandler(async (req, res) => {
  const record = await maintenanceService.startMaintenance(req.params.maintenance_id);
  res.status(200).json({ status: 'OK', message: 'Maintenance started successfully', data: record });
});

const completeMaintenance = asyncHandler(async (req, res) => {
  const record = await maintenanceService.completeMaintenance(
    req.params.maintenance_id,
    req.body.actual_cost
  );
  res.status(200).json({ status: 'OK', message: 'Maintenance completed successfully', data: record });
});

const deleteMaintenance = asyncHandler(async (req, res) => {
  await maintenanceService.deleteMaintenance(req.params.maintenance_id);
  res.status(200).json({ status: 'OK', message: 'Maintenance record deleted successfully' });
});

module.exports = {
  getAllMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  startMaintenance,
  completeMaintenance,
  deleteMaintenance,
};
