const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

function calculateTotalCost(liters, pricePerLiter) {
  if (liters === null || liters === undefined || pricePerLiter === null || pricePerLiter === undefined) {
    return null;
  }

  return Number((Number(liters) * Number(pricePerLiter)).toFixed(2));
}

async function verifyForeignKeys(vehicleId, driverId, tripId) {
  if (vehicleId) {
    const result = await pool.query(
      'SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1',
      [vehicleId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Invalid vehicle_id', 400);
    }
  }

  if (driverId) {
    const result = await pool.query(
      'SELECT driver_id FROM drivers WHERE driver_id = $1',
      [driverId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Invalid driver_id', 400);
    }
  }

  if (tripId) {
    const result = await pool.query(
      'SELECT trip_id FROM trips WHERE trip_id = $1',
      [tripId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Invalid trip_id', 400);
    }
  }
}

async function getAllFuelLogs() {
  const result = await pool.query(
    `SELECT f.*,
            v.registration_no AS vehicle_registration_no,
            d.license_no AS driver_license_no
     FROM fuel_logs f
     LEFT JOIN vehicles v ON v.vehicle_id = f.vehicle_id
     LEFT JOIN drivers d ON d.driver_id = f.driver_id
     ORDER BY f.fuel_date DESC NULLS LAST`
  );
  return result.rows;
}

async function getFuelLogById(fuelId) {
  const result = await pool.query(
    `SELECT f.*,
            v.registration_no AS vehicle_registration_no,
            d.license_no AS driver_license_no
     FROM fuel_logs f
     LEFT JOIN vehicles v ON v.vehicle_id = f.vehicle_id
     LEFT JOIN drivers d ON d.driver_id = f.driver_id
     WHERE f.fuel_id = $1`,
    [fuelId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Fuel log not found', 404);
  }

  return result.rows[0];
}

async function createFuelLog(data) {
  const { vehicle_id, driver_id, trip_id, fuel_date, liters, price_per_liter, odometer } = data;

  await verifyForeignKeys(vehicle_id, driver_id, trip_id);

  const total_cost = calculateTotalCost(liters, price_per_liter);

  const result = await pool.query(
    `INSERT INTO fuel_logs (
       vehicle_id, driver_id, trip_id, fuel_date,
       liters, price_per_liter, total_cost, odometer
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      vehicle_id ?? null,
      driver_id ?? null,
      trip_id ?? null,
      fuel_date ?? null,
      liters ?? null,
      price_per_liter ?? null,
      total_cost,
      odometer ?? null,
    ]
  );

  return result.rows[0];
}

async function updateFuelLog(fuelId, data) {
  const existing = await getFuelLogById(fuelId);

  if (data.vehicle_id !== undefined || data.driver_id !== undefined || data.trip_id !== undefined) {
    await verifyForeignKeys(
      data.vehicle_id !== undefined ? data.vehicle_id : existing.vehicle_id,
      data.driver_id !== undefined ? data.driver_id : existing.driver_id,
      data.trip_id !== undefined ? data.trip_id : existing.trip_id
    );
  }

  const liters = data.liters !== undefined ? data.liters : existing.liters;
  const pricePerLiter =
    data.price_per_liter !== undefined ? data.price_per_liter : existing.price_per_liter;
  const total_cost = calculateTotalCost(liters, pricePerLiter);

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'vehicle_id',
    'driver_id',
    'trip_id',
    'fuel_date',
    'liters',
    'price_per_liter',
    'odometer',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex += 1;
    }
  }

  fields.push(`total_cost = $${paramIndex}`);
  values.push(total_cost);
  paramIndex += 1;

  if (fields.length === 1) {
    throw new AppError('No valid fields provided for update', 400);
  }

  values.push(fuelId);

  const result = await pool.query(
    `UPDATE fuel_logs SET ${fields.join(', ')} WHERE fuel_id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0];
}

async function deleteFuelLog(fuelId) {
  await getFuelLogById(fuelId);

  const result = await pool.query(
    'DELETE FROM fuel_logs WHERE fuel_id = $1 RETURNING fuel_id',
    [fuelId]
  );

  return result.rows[0];
}

module.exports = {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
