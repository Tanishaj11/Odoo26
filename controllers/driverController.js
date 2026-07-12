<<<<<<< HEAD
const driverService = require('../services/driverService');
const asyncHandler = require('../utils/asyncHandler');

const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getAllDrivers();
  res.status(200).json({ status: 'OK', data: drivers });
});

const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.driver_id);
  res.status(200).json({ status: 'OK', data: driver });
});

const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  res.status(201).json({ status: 'OK', message: 'Driver created successfully', data: driver });
});

const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(req.params.driver_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Driver updated successfully', data: driver });
});

const deleteDriver = asyncHandler(async (req, res) => {
  await driverService.deleteDriver(req.params.driver_id);
  res.status(200).json({ status: 'OK', message: 'Driver deleted successfully' });
});

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
=======
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Driver
const createDriver = asyncHandler(async (req, res) => {
  const {
    user_id,
    license_no,
    license_type,
    license_expiry,
    joining_date,
    safety_score,
    total_trips,
    status
  } = req.body;

  if (!license_no || !license_expiry) {
    throw new AppError('license_no and license_expiry are required', 400);
  }

  // If user_id is provided, verify user exists
  if (user_id) {
    const userResult = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
    if (userResult.rowCount === 0) {
      throw new AppError('Associated user not found', 400);
    }
  }

  const query = `
    INSERT INTO drivers (
      user_id, license_no, license_type, license_expiry, joining_date,
      safety_score, total_trips, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING driver_id, user_id, license_no, license_type, license_expiry, joining_date,
              safety_score, total_trips, status
  `;

  const values = [
    user_id || null,
    license_no.trim(),
    license_type ? license_type.trim() : null,
    license_expiry,
    joining_date || null,
    safety_score !== undefined ? safety_score : 100,
    total_trips !== undefined ? total_trips : 0,
    status || 'Available'
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Driver created successfully',
    data: result.rows[0],
  });
});

// Get All Drivers
const getAllDrivers = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM drivers');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Driver By ID
const getDriverById = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;

  const result = await pool.query('SELECT * FROM drivers WHERE driver_id = $1', [driver_id]);

  if (result.rowCount === 0) {
    throw new AppError('Driver not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Driver
const updateDriver = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;
  const {
    user_id,
    license_no,
    license_type,
    license_expiry,
    joining_date,
    safety_score,
    total_trips,
    status
  } = req.body;

  if (!license_no || !license_expiry) {
    throw new AppError('license_no and license_expiry are required', 400);
  }

  if (user_id) {
    const userResult = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
    if (userResult.rowCount === 0) {
      throw new AppError('Associated user not found', 400);
    }
  }

  const query = `
    UPDATE drivers
    SET user_id = $1,
        license_no = $2,
        license_type = $3,
        license_expiry = $4,
        joining_date = $5,
        safety_score = $6,
        total_trips = $7,
        status = $8
    WHERE driver_id = $9
    RETURNING *
  `;

  const values = [
    user_id || null,
    license_no.trim(),
    license_type ? license_type.trim() : null,
    license_expiry,
    joining_date || null,
    safety_score !== undefined ? safety_score : 100,
    total_trips !== undefined ? total_trips : 0,
    status || 'Available',
    driver_id
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new AppError('Driver not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Driver updated successfully',
    data: result.rows[0],
  });
});

// Delete Driver
const deleteDriver = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;

  const result = await pool.query('DELETE FROM drivers WHERE driver_id = $1 RETURNING driver_id', [driver_id]);

  if (result.rowCount === 0) {
    throw new AppError('Driver not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Driver deleted successfully',
  });
});

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
>>>>>>> backend-tanisha
  updateDriver,
  deleteDriver,
};
