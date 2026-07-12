const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllTrips() {
  const result = await pool.query(
    `SELECT t.*,
            v.registration_no AS vehicle_registration_no,
            d.license_no AS driver_license_no
     FROM trips t
     LEFT JOIN vehicles v ON v.vehicle_id = t.vehicle_id
     LEFT JOIN drivers d ON d.driver_id = t.driver_id
     ORDER BY t.created_at DESC`
  );
  return result.rows;
}

async function getTripById(tripId) {
  const result = await pool.query(
    `SELECT t.*,
            v.registration_no AS vehicle_registration_no,
            v.capacity_kg AS vehicle_capacity_kg,
            d.license_no AS driver_license_no,
            d.license_expiry AS driver_license_expiry
     FROM trips t
     LEFT JOIN vehicles v ON v.vehicle_id = t.vehicle_id
     LEFT JOIN drivers d ON d.driver_id = t.driver_id
     WHERE t.trip_id = $1`,
    [tripId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Trip not found', 404);
  }

  return result.rows[0];
}

async function verifyForeignKeys(vehicleId, driverId, client = pool) {
  if (vehicleId) {
    const vehicleResult = await client.query(
      'SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1',
      [vehicleId]
    );

    if (vehicleResult.rowCount === 0) {
      throw new AppError('Invalid vehicle_id', 400);
    }
  }

  if (driverId) {
    const driverResult = await client.query(
      'SELECT driver_id FROM drivers WHERE driver_id = $1',
      [driverId]
    );

    if (driverResult.rowCount === 0) {
      throw new AppError('Invalid driver_id', 400);
    }
  }
}

async function createTrip(data) {
  const {
    source,
    destination,
    cargo_type,
    cargo_weight,
    planned_distance,
    estimated_duration,
    vehicle_id,
    driver_id,
  } = data;

  if (!source || !destination) {
    throw new AppError('source and destination are required', 400);
  }

  await verifyForeignKeys(vehicle_id, driver_id);

  const result = await pool.query(
    `INSERT INTO trips (
       source, destination, cargo_type, cargo_weight,
       planned_distance, estimated_duration, vehicle_id, driver_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      source,
      destination,
      cargo_type ?? null,
      cargo_weight ?? null,
      planned_distance ?? null,
      estimated_duration ?? null,
      vehicle_id ?? null,
      driver_id ?? null,
    ]
  );

  return result.rows[0];
}

async function updateTrip(tripId, data) {
  const existing = await getTripById(tripId);

  if (existing.status === 'Dispatched' || existing.status === 'Completed') {
    throw new AppError('Cannot update a dispatched or completed trip', 400);
  }

  const { vehicle_id, driver_id } = data;
  await verifyForeignKeys(
    vehicle_id !== undefined ? vehicle_id : existing.vehicle_id,
    driver_id !== undefined ? driver_id : existing.driver_id
  );

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'source',
    'destination',
    'cargo_type',
    'cargo_weight',
    'planned_distance',
    'estimated_duration',
    'vehicle_id',
    'driver_id',
    'status',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex += 1;
    }
  }

  if (fields.length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  values.push(tripId);

  const result = await pool.query(
    `UPDATE trips SET ${fields.join(', ')} WHERE trip_id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0];
}

async function dispatchTrip(tripId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const tripResult = await client.query(
      `SELECT t.trip_id, t.status, t.cargo_weight, t.vehicle_id, t.driver_id,
              v.status AS vehicle_status, v.capacity_kg,
              d.status AS driver_status, d.license_expiry
       FROM trips t
       INNER JOIN vehicles v ON v.vehicle_id = t.vehicle_id
       INNER JOIN drivers d ON d.driver_id = t.driver_id
       WHERE t.trip_id = $1
       FOR UPDATE OF t, v, d`,
      [tripId]
    );

    if (tripResult.rowCount === 0) {
      throw new AppError('Trip not found', 404);
    }

    const trip = tripResult.rows[0];

    if (trip.status !== 'Created') {
      throw new AppError('Only trips with status Created can be dispatched', 400);
    }

    if (!trip.vehicle_id || !trip.driver_id) {
      throw new AppError('Trip must have both vehicle_id and driver_id assigned', 400);
    }

    if (trip.vehicle_status !== 'Available') {
      throw new AppError('Vehicle must be Available before dispatch', 400);
    }

    if (trip.driver_status !== 'Available') {
      throw new AppError('Driver must be Available before dispatch', 400);
    }

    const today = new Date().toISOString().slice(0, 10);
    if (trip.license_expiry < today) {
      throw new AppError('Driver license is expired', 400);
    }

    if (
      trip.cargo_weight !== null &&
      trip.capacity_kg !== null &&
      Number(trip.cargo_weight) > Number(trip.capacity_kg)
    ) {
      throw new AppError('Cargo weight cannot exceed vehicle capacity', 400);
    }

    const updatedTrip = await client.query(
      `UPDATE trips
       SET status = 'Dispatched', dispatch_time = CURRENT_TIMESTAMP
       WHERE trip_id = $1
       RETURNING *`,
      [tripId]
    );

    await client.query(
      `UPDATE vehicles SET status = 'On Trip' WHERE vehicle_id = $1`,
      [trip.vehicle_id]
    );

    await client.query(
      `UPDATE drivers SET status = 'On Trip', total_trips = total_trips + 1 WHERE driver_id = $1`,
      [trip.driver_id]
    );

    await client.query('COMMIT');
    return updatedTrip.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function completeTrip(tripId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const tripResult = await client.query(
      `SELECT trip_id, status, vehicle_id, driver_id
       FROM trips
       WHERE trip_id = $1
       FOR UPDATE`,
      [tripId]
    );

    if (tripResult.rowCount === 0) {
      throw new AppError('Trip not found', 404);
    }

    const trip = tripResult.rows[0];

    if (trip.status !== 'Dispatched') {
      throw new AppError('Only dispatched trips can be completed', 400);
    }

    const updatedTrip = await client.query(
      `UPDATE trips
       SET status = 'Completed', arrival_time = CURRENT_TIMESTAMP
       WHERE trip_id = $1
       RETURNING *`,
      [tripId]
    );

    await client.query(
      `UPDATE vehicles SET status = 'Available' WHERE vehicle_id = $1`,
      [trip.vehicle_id]
    );

    await client.query(
      `UPDATE drivers SET status = 'Available' WHERE driver_id = $1`,
      [trip.driver_id]
    );

    await client.query('COMMIT');
    return updatedTrip.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function deleteTrip(tripId) {
  const trip = await getTripById(tripId);

  if (trip.status === 'Dispatched') {
    throw new AppError('Cannot delete a dispatched trip', 400);
  }

  const result = await pool.query(
    'DELETE FROM trips WHERE trip_id = $1 RETURNING trip_id',
    [tripId]
  );

  return result.rows[0];
}

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  deleteTrip,
};
