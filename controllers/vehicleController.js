const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Vehicle
const createVehicle = asyncHandler(async (req, res) => {
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
    status
  } = req.body;

  if (!registration_no || !vehicle_type) {
    throw new AppError('registration_no and vehicle_type are required', 400);
  }

  const query = `
    INSERT INTO vehicles (
      registration_no, vehicle_type, brand, model, manufacture_year,
      capacity_kg, odometer_km, acquisition_cost, purchase_date,
      insurance_expiry, pollution_expiry, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING vehicle_id, registration_no, vehicle_type, brand, model, manufacture_year,
              capacity_kg, odometer_km, acquisition_cost, purchase_date,
              insurance_expiry, pollution_expiry, status, created_at
  `;

  const values = [
    registration_no.trim(),
    vehicle_type.trim(),
    brand ? brand.trim() : null,
    model ? model.trim() : null,
    manufacture_year || null,
    capacity_kg || null,
    odometer_km || 0,
    acquisition_cost || null,
    purchase_date || null,
    insurance_expiry || null,
    pollution_expiry || null,
    status || 'Available'
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Vehicle created successfully',
    data: result.rows[0],
  });
});

// Get All Vehicles
const getAllVehicles = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Vehicle By ID
const getVehicleById = asyncHandler(async (req, res) => {
  const { vehicle_id } = req.params;

  const result = await pool.query('SELECT * FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);

  if (result.rowCount === 0) {
    throw new AppError('Vehicle not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Vehicle
const updateVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id } = req.params;
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
    status
  } = req.body;

  if (!registration_no || !vehicle_type) {
    throw new AppError('registration_no and vehicle_type are required', 400);
  }

  const query = `
    UPDATE vehicles
    SET registration_no = $1,
        vehicle_type = $2,
        brand = $3,
        model = $4,
        manufacture_year = $5,
        capacity_kg = $6,
        odometer_km = $7,
        acquisition_cost = $8,
        purchase_date = $9,
        insurance_expiry = $10,
        pollution_expiry = $11,
        status = $12
    WHERE vehicle_id = $13
    RETURNING *
  `;

  const values = [
    registration_no.trim(),
    vehicle_type.trim(),
    brand ? brand.trim() : null,
    model ? model.trim() : null,
    manufacture_year || null,
    capacity_kg || null,
    odometer_km || 0,
    acquisition_cost || null,
    purchase_date || null,
    insurance_expiry || null,
    pollution_expiry || null,
    status || 'Available',
    vehicle_id
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new AppError('Vehicle not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Vehicle updated successfully',
    data: result.rows[0],
  });
});

// Delete Vehicle
const deleteVehicle = asyncHandler(async (req, res) => {
  const { vehicle_id } = req.params;

  const result = await pool.query('DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING vehicle_id', [vehicle_id]);

  if (result.rowCount === 0) {
    throw new AppError('Vehicle not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Vehicle deleted successfully',
  });
});

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
