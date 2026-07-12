const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllDrivers() {
  const result = await pool.query(
    `SELECT d.*, u.full_name, u.email, u.phone
     FROM drivers d
     LEFT JOIN users u ON u.user_id = d.user_id
     ORDER BY d.joining_date DESC NULLS LAST`
  );
  return result.rows;
}

async function getDriverById(driverId) {
  const result = await pool.query(
    `SELECT d.*, u.full_name, u.email, u.phone
     FROM drivers d
     LEFT JOIN users u ON u.user_id = d.user_id
     WHERE d.driver_id = $1`,
    [driverId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Driver not found', 404);
  }

  return result.rows[0];
}

async function createDriver(data) {
  const {
    user_id,
    license_no,
    license_type,
    license_expiry,
    joining_date,
    safety_score,
    status,
  } = data;

  if (!license_no || !license_expiry) {
    throw new AppError('license_no and license_expiry are required', 400);
  }

  if (user_id) {
    const userResult = await pool.query(
      'SELECT user_id FROM users WHERE user_id = $1',
      [user_id]
    );

    if (userResult.rowCount === 0) {
      throw new AppError('Invalid user_id', 400);
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO drivers (
         user_id, license_no, license_type, license_expiry,
         joining_date, safety_score, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        user_id ?? null,
        license_no,
        license_type ?? null,
        license_expiry,
        joining_date ?? null,
        safety_score ?? null,
        status ?? 'Available',
      ]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('License number already exists', 409);
    }
    throw error;
  }
}

async function updateDriver(driverId, data) {
  await getDriverById(driverId);

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'user_id',
    'license_no',
    'license_type',
    'license_expiry',
    'joining_date',
    'safety_score',
    'total_trips',
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

  values.push(driverId);

  try {
    const result = await pool.query(
      `UPDATE drivers SET ${fields.join(', ')} WHERE driver_id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('License number already exists', 409);
    }
    throw error;
  }
}

async function deleteDriver(driverId) {
  await getDriverById(driverId);

  const result = await pool.query(
    'DELETE FROM drivers WHERE driver_id = $1 RETURNING driver_id',
    [driverId]
  );

  return result.rows[0];
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
