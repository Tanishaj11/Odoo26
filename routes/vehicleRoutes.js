const express = require('express');
const {
<<<<<<< HEAD
  getAllVehicles,
  getVehicleById,
  createVehicle,
=======
  createVehicle,
  getAllVehicles,
  getVehicleById,
>>>>>>> backend-tanisha
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/vehicles', getAllVehicles);
router.get('/vehicles/:vehicle_id', getVehicleById);
router.post('/vehicles', createVehicle);
=======
router.post('/vehicles', createVehicle);
router.get('/vehicles', getAllVehicles);
router.get('/vehicles/:vehicle_id', getVehicleById);
>>>>>>> backend-tanisha
router.put('/vehicles/:vehicle_id', updateVehicle);
router.delete('/vehicles/:vehicle_id', deleteVehicle);

module.exports = router;
