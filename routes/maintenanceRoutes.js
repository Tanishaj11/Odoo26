const express = require('express');
const {
<<<<<<< HEAD
  getAllMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  startMaintenance,
  completeMaintenance,
  deleteMaintenance,
=======
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
>>>>>>> backend-tanisha
} = require('../controllers/maintenanceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/maintenance', getAllMaintenanceRecords);
router.get('/maintenance/:maintenance_id', getMaintenanceById);
router.post('/maintenance', createMaintenance);
router.put('/maintenance/:maintenance_id', updateMaintenance);
router.post('/maintenance/:maintenance_id/start', startMaintenance);
router.post('/maintenance/:maintenance_id/complete', completeMaintenance);
router.delete('/maintenance/:maintenance_id', deleteMaintenance);
=======
router.post('/maintenance', createMaintenance);
router.get('/maintenance', getAllMaintenance);
router.get('/maintenance/:maintenance_id', getMaintenanceById);
router.put('/maintenance/:maintenance_id', updateMaintenance);
router.delete('/maintenance/:maintenance_id', deleteMaintenance);
router.patch('/maintenance/:maintenance_id/start', startMaintenance);
router.patch('/maintenance/:maintenance_id/complete', completeMaintenance);
>>>>>>> backend-tanisha

module.exports = router;
