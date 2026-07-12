const express = require('express');
const {
  getAllMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  startMaintenance,
  completeMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/maintenance', getAllMaintenanceRecords);
router.get('/maintenance/:maintenance_id', getMaintenanceById);
router.post('/maintenance', createMaintenance);
router.put('/maintenance/:maintenance_id', updateMaintenance);
router.post('/maintenance/:maintenance_id/start', startMaintenance);
router.post('/maintenance/:maintenance_id/complete', completeMaintenance);
router.delete('/maintenance/:maintenance_id', deleteMaintenance);

module.exports = router;
