const express = require('express');
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/vehicles', getAllVehicles);
router.get('/vehicles/:vehicle_id', getVehicleById);
router.post('/vehicles', createVehicle);
router.put('/vehicles/:vehicle_id', updateVehicle);
router.delete('/vehicles/:vehicle_id', deleteVehicle);

module.exports = router;
