const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Fuel Log
const createFuelLog = asyncHandler(async (req, res) => {
  const {
    vehicle_id,
    driver_id,
    trip_id,
    fuel_date,
    liters,
    price_per_liter,
    odometer
  } = req.body;

  if (!vehicle_id || !fuel_date || liters === undefined || price_per_liter === undefined) {
    throw new AppError('vehicle_id, fuel_date, liters, and price_per_liter are required', 400);
  }

  // Verify vehicle exists
  const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
  if (vRes.rowCount === 0) {
    throw new AppError('Vehicle not found', 400);
  }

  // Verify driver if provided
  if (driver_id) {
    const dRes = await pool.query('SELECT driver_id FROM drivers WHERE driver_id = $1', [driver_id]);
    if (dRes.rowCount === 0) {
      throw new AppError('Driver not found', 400);
    }
  }

  // Verify trip if provided
  if (trip_id) {
    const tRes = await pool.query('SELECT trip_id FROM trips WHERE trip_id = $1', [trip_id]);
    if (tRes.rowCount === 0) {
      throw new AppError('Trip not found', 400);
    }
  }

  // Auto-calculate total_cost
  const total_cost = Number(liters) * Number(price_per_liter);

  const query = `
    INSERT INTO fuel_logs (
      vehicle_id, driver_id, trip_id, fuel_date, liters,
      price_per_liter, total_cost, odometer
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    vehicle_id,
    driver_id || null,
    trip_id || null,
    fuel_date,
    liters,
    price_per_liter,
    total_cost,
    odometer || null
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Fuel log created successfully',
    data: result.rows[0],
  });
});

// Get All Fuel Logs
const getAllFuelLogs = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM fuel_logs ORDER BY fuel_date DESC');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Fuel Log By ID
const getFuelLogById = asyncHandler(async (req, res) => {
  const { fuel_id } = req.params;

  const result = await pool.query('SELECT * FROM fuel_logs WHERE fuel_id = $1', [fuel_id]);

  if (result.rowCount === 0) {
    throw new AppError('Fuel log not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Fuel Log
const updateFuelLog = asyncHandler(async (req, res) => {
  const { fuel_id } = req.params;
  const {
    vehicle_id,
    driver_id,
    trip_id,
    fuel_date,
    liters,
    price_per_liter,
    odometer
  } = req.body;

  if (!vehicle_id || !fuel_date || liters === undefined || price_per_liter === undefined) {
    throw new AppError('vehicle_id, fuel_date, liters, and price_per_liter are required', 400);
  }

  // Verify fuel log exists
  const currentResult = await pool.query('SELECT * FROM fuel_logs WHERE fuel_id = $1', [fuel_id]);
  if (currentResult.rowCount === 0) {
    throw new AppError('Fuel log not found', 404);
  }

  // Verify vehicle exists
  const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
  if (vRes.rowCount === 0) {
    throw new AppError('Vehicle not found', 400);
  }

  // Verify driver if provided
  if (driver_id) {
    const dRes = await pool.query('SELECT driver_id FROM drivers WHERE driver_id = $1', [driver_id]);
    if (dRes.rowCount === 0) {
      throw new AppError('Driver not found', 400);
    }
  }

  // Verify trip if provided
  if (trip_id) {
    const tRes = await pool.query('SELECT trip_id FROM trips WHERE trip_id = $1', [trip_id]);
    if (tRes.rowCount === 0) {
      throw new AppError('Trip not found', 400);
    }
  }

  // Auto-calculate total_cost
  const total_cost = Number(liters) * Number(price_per_liter);

  const query = `
    UPDATE fuel_logs
    SET vehicle_id = $1,
        driver_id = $2,
        trip_id = $3,
        fuel_date = $4,
        liters = $5,
        price_per_liter = $6,
        total_cost = $7,
        odometer = $8
    WHERE fuel_id = $9
    RETURNING *
  `;

  const values = [
    vehicle_id,
    driver_id || null,
    trip_id || null,
    fuel_date,
    liters,
    price_per_liter,
    total_cost,
    odometer || null,
    fuel_id
  ];

  const result = await pool.query(query, values);

  res.status(200).json({
    status: 'OK',
    message: 'Fuel log updated successfully',
    data: result.rows[0],
  });
});

// Delete Fuel Log
const deleteFuelLog = asyncHandler(async (req, res) => {
  const { fuel_id } = req.params;

  const result = await pool.query('DELETE FROM fuel_logs WHERE fuel_id = $1 RETURNING fuel_id', [fuel_id]);

  if (result.rowCount === 0) {
    throw new AppError('Fuel log not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Fuel log deleted successfully',
  });
});

module.exports = {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
};
