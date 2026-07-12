const express = require('express');
const {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuelLogController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/fuel-logs', getAllFuelLogs);
router.get('/fuel-logs/:fuel_id', getFuelLogById);
router.post('/fuel-logs', createFuelLog);
router.put('/fuel-logs/:fuel_id', updateFuelLog);
router.delete('/fuel-logs/:fuel_id', deleteFuelLog);

module.exports = router;
