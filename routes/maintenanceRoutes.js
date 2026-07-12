const express = require('express');
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
} = require('../controllers/maintenanceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/maintenance', createMaintenance);
router.get('/maintenance', getAllMaintenance);
router.get('/maintenance/:maintenance_id', getMaintenanceById);
router.put('/maintenance/:maintenance_id', updateMaintenance);
router.delete('/maintenance/:maintenance_id', deleteMaintenance);
router.patch('/maintenance/:maintenance_id/start', startMaintenance);
router.patch('/maintenance/:maintenance_id/complete', completeMaintenance);

module.exports = router;
