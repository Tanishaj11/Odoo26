const express = require('express');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/drivers', createDriver);
router.get('/drivers', getAllDrivers);
router.get('/drivers/:driver_id', getDriverById);
router.put('/drivers/:driver_id', updateDriver);
router.delete('/drivers/:driver_id', deleteDriver);

module.exports = router;
