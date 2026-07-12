const express = require('express');
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/drivers', getAllDrivers);
router.get('/drivers/:driver_id', getDriverById);
router.post('/drivers', createDriver);
router.put('/drivers/:driver_id', updateDriver);
router.delete('/drivers/:driver_id', deleteDriver);

module.exports = router;
