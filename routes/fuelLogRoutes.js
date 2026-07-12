const express = require('express');
const {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuelLogController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/fuel-logs', createFuelLog);
router.get('/fuel-logs', getAllFuelLogs);
router.get('/fuel-logs/:fuel_id', getFuelLogById);
router.put('/fuel-logs/:fuel_id', updateFuelLog);
router.delete('/fuel-logs/:fuel_id', deleteFuelLog);

module.exports = router;
