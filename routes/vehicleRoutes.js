const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/vehicles', createVehicle);
router.get('/vehicles', getAllVehicles);
router.get('/vehicles/:vehicle_id', getVehicleById);
router.put('/vehicles/:vehicle_id', updateVehicle);
router.delete('/vehicles/:vehicle_id', deleteVehicle);

module.exports = router;
