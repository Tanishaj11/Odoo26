const tripService = require('../services/tripService');
const asyncHandler = require('../utils/asyncHandler');

const getAllTrips = asyncHandler(async (req, res) => {
  const trips = await tripService.getAllTrips();
  res.status(200).json({ status: 'OK', data: trips });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.trip_id);
  res.status(200).json({ status: 'OK', data: trip });
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.body);
  res.status(201).json({ status: 'OK', message: 'Trip created successfully', data: trip });
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(req.params.trip_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Trip updated successfully', data: trip });
});

const dispatchTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.dispatchTrip(req.params.trip_id);
  res.status(200).json({ status: 'OK', message: 'Trip dispatched successfully', data: trip });
});

const completeTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.completeTrip(req.params.trip_id);
  res.status(200).json({ status: 'OK', message: 'Trip completed successfully', data: trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.trip_id);
  res.status(200).json({ status: 'OK', message: 'Trip deleted successfully' });
});

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  deleteTrip,
};
