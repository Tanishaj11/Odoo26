const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllVehicles() {
  const result = await pool.query(
    'SELECT * FROM vehicles ORDER BY created_at DESC'
  );
  return result.rows;
}

async function getVehicleById(vehicleId) {
  const result = await pool.query(
    'SELECT * FROM vehicles WHERE vehicle_id = $1',
    [vehicleId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Vehicle not found', 404);
  }

  return result.rows[0];
}

async function createVehicle(data) {
  const {
    registration_no,
    vehicle_type,
    brand,
    model,
    manufacture_year,
    capacity_kg,
    odometer_km,
    acquisition_cost,
    purchase_date,
    insurance_expiry,
    pollution_expiry,
    status,
  } = data;

  if (!registration_no || !vehicle_type) {
    throw new AppError('registration_no and vehicle_type are required', 400);
  }

  try {
    const result = await pool.query(
      `INSERT INTO vehicles (
         registration_no, vehicle_type, brand, model, manufacture_year,
         capacity_kg, odometer_km, acquisition_cost, purchase_date,
         insurance_expiry, pollution_expiry, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        registration_no,
        vehicle_type,
        brand ?? null,
        model ?? null,
        manufacture_year ?? null,
        capacity_kg ?? null,
        odometer_km ?? null,
        acquisition_cost ?? null,
        purchase_date ?? null,
        insurance_expiry ?? null,
        pollution_expiry ?? null,
        status ?? 'Available',
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('Registration number already exists', 409);
    }
    throw error;
  }
}

async function updateVehicle(vehicleId, data) {
  await getVehicleById(vehicleId);

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'registration_no',
    'vehicle_type',
    'brand',
    'model',
    'manufacture_year',
    'capacity_kg',
    'odometer_km',
    'acquisition_cost',
    'purchase_date',
    'insurance_expiry',
    'pollution_expiry',
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

  values.push(vehicleId);

  try {
    const result = await pool.query(
      `UPDATE vehicles SET ${fields.join(', ')} WHERE vehicle_id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('Registration number already exists', 409);
    }
    throw error;
  }
}

async function deleteVehicle(vehicleId) {
  await getVehicleById(vehicleId);

  const result = await pool.query(
    'DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING vehicle_id',
    [vehicleId]
  );

  return result.rows[0];
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
