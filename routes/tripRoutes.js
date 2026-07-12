const express = require('express');
const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip,
} = require('../controllers/tripController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/trips', createTrip);
router.get('/trips', getAllTrips);
router.get('/trips/:trip_id', getTripById);
router.put('/trips/:trip_id', updateTrip);
router.delete('/trips/:trip_id', deleteTrip);
router.patch('/trips/:trip_id/start', startTrip);
router.patch('/trips/:trip_id/complete', completeTrip);

module.exports = router;
