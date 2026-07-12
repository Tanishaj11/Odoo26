const express = require('express');
const {
<<<<<<< HEAD
  getAllDrivers,
  getDriverById,
  createDriver,
=======
  createDriver,
  getAllDrivers,
  getDriverById,
>>>>>>> backend-tanisha
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/drivers', getAllDrivers);
router.get('/drivers/:driver_id', getDriverById);
router.post('/drivers', createDriver);
=======
router.post('/drivers', createDriver);
router.get('/drivers', getAllDrivers);
router.get('/drivers/:driver_id', getDriverById);
>>>>>>> backend-tanisha
router.put('/drivers/:driver_id', updateDriver);
router.delete('/drivers/:driver_id', deleteDriver);

module.exports = router;
