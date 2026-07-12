const express = require('express');
const {
<<<<<<< HEAD
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
=======
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
>>>>>>> backend-tanisha
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuelLogController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/fuel-logs', getAllFuelLogs);
router.get('/fuel-logs/:fuel_id', getFuelLogById);
router.post('/fuel-logs', createFuelLog);
=======
router.post('/fuel-logs', createFuelLog);
router.get('/fuel-logs', getAllFuelLogs);
router.get('/fuel-logs/:fuel_id', getFuelLogById);
>>>>>>> backend-tanisha
router.put('/fuel-logs/:fuel_id', updateFuelLog);
router.delete('/fuel-logs/:fuel_id', deleteFuelLog);

module.exports = router;
