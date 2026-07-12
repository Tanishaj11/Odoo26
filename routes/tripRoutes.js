const express = require('express');
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/trips', getAllTrips);
router.get('/trips/:trip_id', getTripById);
router.post('/trips', createTrip);
router.put('/trips/:trip_id', updateTrip);
router.post('/trips/:trip_id/dispatch', dispatchTrip);
router.post('/trips/:trip_id/complete', completeTrip);
router.delete('/trips/:trip_id', deleteTrip);

module.exports = router;
