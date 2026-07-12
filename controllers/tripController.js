const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Trip
const createTrip = asyncHandler(async (req, res) => {
  const {
    source,
    destination,
    cargo_type,
    cargo_weight,
    planned_distance,
    estimated_duration,
    vehicle_id,
    driver_id
  } = req.body;

  if (!source || !destination) {
    throw new AppError('source and destination are required', 400);
  }

  // Verify vehicle exists if provided
  if (vehicle_id) {
    const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
    if (vRes.rowCount === 0) {
      throw new AppError('Vehicle not found', 400);
    }
  }

  // Verify driver exists if provided
  if (driver_id) {
    const dRes = await pool.query('SELECT driver_id FROM drivers WHERE driver_id = $1', [driver_id]);
    if (dRes.rowCount === 0) {
      throw new AppError('Driver not found', 400);
    }
  }

  const query = `
    INSERT INTO trips (
      source, destination, cargo_type, cargo_weight, planned_distance,
      estimated_duration, vehicle_id, driver_id, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Created')
    RETURNING *
  `;

  const values = [
    source.trim(),
    destination.trim(),
    cargo_type ? cargo_type.trim() : null,
    cargo_weight || null,
    planned_distance || null,
    estimated_duration || null,
    vehicle_id || null,
    driver_id || null
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Trip created successfully',
    data: result.rows[0],
  });
});

// Get All Trips
const getAllTrips = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM trips ORDER BY created_at DESC');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Trip By ID
const getTripById = asyncHandler(async (req, res) => {
  const { trip_id } = req.params;

  const result = await pool.query('SELECT * FROM trips WHERE trip_id = $1', [trip_id]);

  if (result.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Trip
const updateTrip = asyncHandler(async (req, res) => {
  const { trip_id } = req.params;
  const {
    source,
    destination,
    cargo_type,
    cargo_weight,
    planned_distance,
    estimated_duration,
    vehicle_id,
    driver_id,
    status
  } = req.body;

  if (!source || !destination) {
    throw new AppError('source and destination are required', 400);
  }

  // Retrieve current trip to ensure it exists
  const currentResult = await pool.query('SELECT * FROM trips WHERE trip_id = $1', [trip_id]);
  if (currentResult.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  // Verify vehicle exists if updated
  if (vehicle_id) {
    const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
    if (vRes.rowCount === 0) {
      throw new AppError('Vehicle not found', 400);
    }
  }

  // Verify driver exists if updated
  if (driver_id) {
    const dRes = await pool.query('SELECT driver_id FROM drivers WHERE driver_id = $1', [driver_id]);
    if (dRes.rowCount === 0) {
      throw new AppError('Driver not found', 400);
    }
  }

  const query = `
    UPDATE trips
    SET source = $1,
        destination = $2,
        cargo_type = $3,
        cargo_weight = $4,
        planned_distance = $5,
        estimated_duration = $6,
        vehicle_id = $7,
        driver_id = $8,
        status = $9
    WHERE trip_id = $10
    RETURNING *
  `;

  const values = [
    source.trim(),
    destination.trim(),
    cargo_type ? cargo_type.trim() : null,
    cargo_weight || null,
    planned_distance || null,
    estimated_duration || null,
    vehicle_id || null,
    driver_id || null,
    status || currentResult.rows[0].status,
    trip_id
  ];

  const result = await pool.query(query, values);

  res.status(200).json({
    status: 'OK',
    message: 'Trip updated successfully',
    data: result.rows[0],
  });
});

// Delete Trip
const deleteTrip = asyncHandler(async (req, res) => {
  const { trip_id } = req.params;

  const result = await pool.query('DELETE FROM trips WHERE trip_id = $1 RETURNING trip_id', [trip_id]);

  if (result.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Trip deleted successfully',
  });
});

// Start Trip (Dispatch)
const startTrip = asyncHandler(async (req, res) => {
  const { trip_id } = req.params;

  // Retrieve trip details
  const tripResult = await pool.query('SELECT * FROM trips WHERE trip_id = $1', [trip_id]);
  if (tripResult.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  const trip = tripResult.rows[0];

  if (trip.status !== 'Created') {
    throw new AppError(`Trip cannot be started because its current status is ${trip.status}`, 400);
  }

  if (!trip.vehicle_id) {
    throw new AppError('Trip does not have an assigned vehicle', 400);
  }

  if (!trip.driver_id) {
    throw new AppError('Trip does not have an assigned driver', 400);
  }

  // Retrieve vehicle
  const vehicleResult = await pool.query('SELECT status, capacity_kg FROM vehicles WHERE vehicle_id = $1', [trip.vehicle_id]);
  if (vehicleResult.rowCount === 0) {
    throw new AppError('Assigned vehicle not found', 400);
  }
  const vehicle = vehicleResult.rows[0];

  // Retrieve driver
  const driverResult = await pool.query('SELECT status, license_expiry FROM drivers WHERE driver_id = $1', [trip.driver_id]);
  if (driverResult.rowCount === 0) {
    throw new AppError('Assigned driver not found', 400);
  }
  const driver = driverResult.rows[0];

  // Validation 1: Vehicle must be Available before dispatch
  if (vehicle.status !== 'Available') {
    throw new AppError('Vehicle must be Available before dispatch', 400);
  }

  // Validation 2: Driver must be Available before dispatch
  if (driver.status !== 'Available') {
    throw new AppError('Driver must be Available before dispatch', 400);
  }

  // Validation 3: Driver license cannot be expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const licenseExpiry = new Date(driver.license_expiry);
  if (licenseExpiry < today) {
    throw new AppError('Driver license cannot be expired', 400);
  }

  // Validation 4: Cargo weight cannot exceed vehicle capacity
  if (trip.cargo_weight !== null && vehicle.capacity_kg !== null) {
    if (Number(trip.cargo_weight) > Number(vehicle.capacity_kg)) {
      throw new AppError('Cargo weight cannot exceed vehicle capacity', 400);
    }
  }

  // Update states atomically
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update vehicle status to 'On Trip'
    await client.query('UPDATE vehicles SET status = \'On Trip\' WHERE vehicle_id = $1', [trip.vehicle_id]);

    // Update driver status to 'On Trip'
    await client.query('UPDATE drivers SET status = \'On Trip\' WHERE driver_id = $1', [trip.driver_id]);

    // Update trip status to 'Dispatched' and set dispatch_time
    const updatedTripRes = await client.query(
      `UPDATE trips
       SET status = 'Dispatched', dispatch_time = CURRENT_TIMESTAMP
       WHERE trip_id = $1
       RETURNING *`,
      [trip_id]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 'OK',
      message: 'Trip started successfully',
      data: updatedTripRes.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Complete Trip
const completeTrip = asyncHandler(async (req, res) => {
  const { trip_id } = req.params;

  // Retrieve trip details
  const tripResult = await pool.query('SELECT * FROM trips WHERE trip_id = $1', [trip_id]);
  if (tripResult.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  const trip = tripResult.rows[0];

  if (trip.status !== 'Dispatched') {
    throw new AppError(`Trip cannot be completed because its current status is ${trip.status}`, 400);
  }

  // Update states atomically
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update vehicle status back to 'Available'
    if (trip.vehicle_id) {
      await client.query('UPDATE vehicles SET status = \'Available\' WHERE vehicle_id = $1', [trip.vehicle_id]);
    }

    // Update driver status back to 'Available'
    if (trip.driver_id) {
      await client.query('UPDATE drivers SET status = \'Available\' WHERE driver_id = $1', [trip.driver_id]);
    }

    // Update trip status to 'Completed' and set arrival_time
    const updatedTripRes = await client.query(
      `UPDATE trips
       SET status = 'Completed', arrival_time = CURRENT_TIMESTAMP
       WHERE trip_id = $1
       RETURNING *`,
      [trip_id]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 'OK',
      message: 'Trip completed successfully',
      data: updatedTripRes.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip,
};
