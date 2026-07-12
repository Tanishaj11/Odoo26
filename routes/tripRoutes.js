const express = require('express');
const {
<<<<<<< HEAD
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  deleteTrip,
=======
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip,
>>>>>>> backend-tanisha
} = require('../controllers/tripController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/trips', getAllTrips);
router.get('/trips/:trip_id', getTripById);
router.post('/trips', createTrip);
router.put('/trips/:trip_id', updateTrip);
router.post('/trips/:trip_id/dispatch', dispatchTrip);
router.post('/trips/:trip_id/complete', completeTrip);
router.delete('/trips/:trip_id', deleteTrip);
=======
router.post('/trips', createTrip);
router.get('/trips', getAllTrips);
router.get('/trips/:trip_id', getTripById);
router.put('/trips/:trip_id', updateTrip);
router.delete('/trips/:trip_id', deleteTrip);
router.patch('/trips/:trip_id/start', startTrip);
router.patch('/trips/:trip_id/complete', completeTrip);
>>>>>>> backend-tanisha

module.exports = router;
