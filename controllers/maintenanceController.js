const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Maintenance Record
const createMaintenance = asyncHandler(async (req, res) => {
  const {
    vehicle_id,
    issue,
    maintenance_type,
    priority,
    reported_date,
    estimated_cost
  } = req.body;

  if (!vehicle_id || !reported_date) {
    throw new AppError('vehicle_id and reported_date are required', 400);
  }

  // Verify vehicle exists
  const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
  if (vRes.rowCount === 0) {
    throw new AppError('Vehicle not found', 400);
  }

  const query = `
    INSERT INTO maintenance (
      vehicle_id, issue, maintenance_type, priority, reported_date,
      estimated_cost, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
    RETURNING *
  `;

  const values = [
    vehicle_id,
    issue ? issue.trim() : null,
    maintenance_type || null,
    priority ? priority.trim() : null,
    reported_date,
    estimated_cost || null
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Maintenance record created successfully',
    data: result.rows[0],
  });
});

// Get All Maintenance Records
const getAllMaintenance = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM maintenance ORDER BY reported_date DESC');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Maintenance Record By ID
const getMaintenanceById = asyncHandler(async (req, res) => {
  const { maintenance_id } = req.params;

  const result = await pool.query('SELECT * FROM maintenance WHERE maintenance_id = $1', [maintenance_id]);

  if (result.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Maintenance Record
const updateMaintenance = asyncHandler(async (req, res) => {
  const { maintenance_id } = req.params;
  const {
    vehicle_id,
    issue,
    maintenance_type,
    priority,
    reported_date,
    completed_date,
    estimated_cost,
    actual_cost,
    status
  } = req.body;

  if (!vehicle_id || !reported_date) {
    throw new AppError('vehicle_id and reported_date are required', 400);
  }

  // Retrieve current record
  const currentResult = await pool.query('SELECT * FROM maintenance WHERE maintenance_id = $1', [maintenance_id]);
  if (currentResult.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  // Verify vehicle exists if updated
  const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
  if (vRes.rowCount === 0) {
    throw new AppError('Vehicle not found', 400);
  }

  const query = `
    UPDATE maintenance
    SET vehicle_id = $1,
        issue = $2,
        maintenance_type = $3,
        priority = $4,
        reported_date = $5,
        completed_date = $6,
        estimated_cost = $7,
        actual_cost = $8,
        status = $9
    WHERE maintenance_id = $10
    RETURNING *
  `;

  const values = [
    vehicle_id,
    issue ? issue.trim() : null,
    maintenance_type || null,
    priority ? priority.trim() : null,
    reported_date,
    completed_date || null,
    estimated_cost || null,
    actual_cost || null,
    status || currentResult.rows[0].status,
    maintenance_id
  ];

  const result = await pool.query(query, values);

  res.status(200).json({
    status: 'OK',
    message: 'Maintenance record updated successfully',
    data: result.rows[0],
  });
});

// Delete Maintenance Record
const deleteMaintenance = asyncHandler(async (req, res) => {
  const { maintenance_id } = req.params;

  const result = await pool.query('DELETE FROM maintenance WHERE maintenance_id = $1 RETURNING maintenance_id', [maintenance_id]);

  if (result.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Maintenance record deleted successfully',
  });
});

// Start Maintenance (transition to In Progress & Vehicle to In Maintenance)
const startMaintenance = asyncHandler(async (req, res) => {
  const { maintenance_id } = req.params;

  const mainResult = await pool.query('SELECT * FROM maintenance WHERE maintenance_id = $1', [maintenance_id]);
  if (mainResult.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  const record = mainResult.rows[0];

  if (record.status === 'Completed' || record.status === 'In Progress') {
    throw new AppError(`Maintenance record cannot be started because status is ${record.status}`, 400);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Change vehicle status to 'In Maintenance'
    await client.query('UPDATE vehicles SET status = \'In Maintenance\' WHERE vehicle_id = $1', [record.vehicle_id]);

    // Change maintenance status to 'In Progress'
    const updatedRecord = await client.query(
      `UPDATE maintenance
       SET status = 'In Progress'
       WHERE maintenance_id = $1
       RETURNING *`,
      [maintenance_id]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 'OK',
      message: 'Maintenance started successfully',
      data: updatedRecord.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Complete Maintenance (transition to Completed & Vehicle to Available)
const completeMaintenance = asyncHandler(async (req, res) => {
  const { maintenance_id } = req.params;
  const { actual_cost } = req.body;

  const mainResult = await pool.query('SELECT * FROM maintenance WHERE maintenance_id = $1', [maintenance_id]);
  if (mainResult.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  const record = mainResult.rows[0];

  if (record.status !== 'In Progress') {
    throw new AppError(`Maintenance record cannot be completed because status is ${record.status}`, 400);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Change vehicle status back to 'Available'
    await client.query('UPDATE vehicles SET status = \'Available\' WHERE vehicle_id = $1', [record.vehicle_id]);

    // Change maintenance status to 'Completed'
    const updatedRecord = await client.query(
      `UPDATE maintenance
       SET status = 'Completed', completed_date = CURRENT_DATE, actual_cost = COALESCE($2, actual_cost)
       WHERE maintenance_id = $1
       RETURNING *`,
      [maintenance_id, actual_cost || null]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 'OK',
      message: 'Maintenance completed successfully',
      data: updatedRecord.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
};
