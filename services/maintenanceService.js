const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllMaintenanceRecords() {
  const result = await pool.query(
    `SELECT m.*, v.registration_no AS vehicle_registration_no
     FROM maintenance m
     LEFT JOIN vehicles v ON v.vehicle_id = m.vehicle_id
     ORDER BY m.reported_date DESC NULLS LAST`
  );
  return result.rows;
}

async function getMaintenanceById(maintenanceId) {
  const result = await pool.query(
    `SELECT m.*, v.registration_no AS vehicle_registration_no, v.status AS vehicle_status
     FROM maintenance m
     LEFT JOIN vehicles v ON v.vehicle_id = m.vehicle_id
     WHERE m.maintenance_id = $1`,
    [maintenanceId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Maintenance record not found', 404);
  }

  return result.rows[0];
}

async function createMaintenance(data) {
  const {
    vehicle_id,
    issue,
    maintenance_type,
    priority,
    reported_date,
    estimated_cost,
    status,
  } = data;

  if (!vehicle_id) {
    throw new AppError('vehicle_id is required', 400);
  }

  const vehicleResult = await pool.query(
    'SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1',
    [vehicle_id]
  );

  if (vehicleResult.rowCount === 0) {
    throw new AppError('Invalid vehicle_id', 400);
  }

  const result = await pool.query(
    `INSERT INTO maintenance (
       vehicle_id, issue, maintenance_type, priority,
       reported_date, estimated_cost, status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      vehicle_id,
      issue ?? null,
      maintenance_type ?? null,
      priority ?? null,
      reported_date ?? null,
      estimated_cost ?? null,
      status ?? 'Pending',
    ]
  );

  return result.rows[0];
}

async function updateMaintenance(maintenanceId, data) {
  const existing = await getMaintenanceById(maintenanceId);

  if (existing.status === 'In Progress' || existing.status === 'Completed') {
    throw new AppError('Cannot update maintenance that is in progress or completed', 400);
  }

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = [
    'vehicle_id',
    'issue',
    'maintenance_type',
    'priority',
    'reported_date',
    'estimated_cost',
    'actual_cost',
    'status',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'vehicle_id') {
        const vehicleResult = await pool.query(
          'SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1',
          [data.vehicle_id]
        );

        if (vehicleResult.rowCount === 0) {
          throw new AppError('Invalid vehicle_id', 400);
        }
      }

      fields.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex += 1;
    }
  }

  if (fields.length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  values.push(maintenanceId);

  const result = await pool.query(
    `UPDATE maintenance SET ${fields.join(', ')} WHERE maintenance_id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0];
}

async function startMaintenance(maintenanceId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const maintenanceResult = await client.query(
      `SELECT m.maintenance_id, m.status, m.vehicle_id, v.status AS vehicle_status
       FROM maintenance m
       JOIN vehicles v ON v.vehicle_id = m.vehicle_id
       WHERE m.maintenance_id = $1
       FOR UPDATE OF m, v`,
      [maintenanceId]
    );

    if (maintenanceResult.rowCount === 0) {
      throw new AppError('Maintenance record not found', 404);
    }

    const record = maintenanceResult.rows[0];

    if (!['Pending', 'Approved'].includes(record.status)) {
      throw new AppError('Only pending or approved maintenance can be started', 400);
    }

    if (record.vehicle_status !== 'Available') {
      throw new AppError('Vehicle must be Available before starting maintenance', 400);
    }

    const updated = await client.query(
      `UPDATE maintenance SET status = 'In Progress' WHERE maintenance_id = $1 RETURNING *`,
      [maintenanceId]
    );

    await client.query(
      `UPDATE vehicles SET status = 'In Maintenance' WHERE vehicle_id = $1`,
      [record.vehicle_id]
    );

    await client.query('COMMIT');
    return updated.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function completeMaintenance(maintenanceId, actualCost) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const maintenanceResult = await client.query(
      `SELECT maintenance_id, status, vehicle_id
       FROM maintenance
       WHERE maintenance_id = $1
       FOR UPDATE`,
      [maintenanceId]
    );

    if (maintenanceResult.rowCount === 0) {
      throw new AppError('Maintenance record not found', 404);
    }

    const record = maintenanceResult.rows[0];

    if (record.status !== 'In Progress') {
      throw new AppError('Only in-progress maintenance can be completed', 400);
    }

    const updated = await client.query(
      `UPDATE maintenance
       SET status = 'Completed',
           completed_date = CURRENT_DATE,
           actual_cost = COALESCE($2, actual_cost)
       WHERE maintenance_id = $1
       RETURNING *`,
      [maintenanceId, actualCost ?? null]
    );

    await client.query(
      `UPDATE vehicles SET status = 'Available' WHERE vehicle_id = $1`,
      [record.vehicle_id]
    );

    await client.query('COMMIT');
    return updated.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function deleteMaintenance(maintenanceId) {
  const record = await getMaintenanceById(maintenanceId);

  if (record.status === 'In Progress') {
    throw new AppError('Cannot delete maintenance that is in progress', 400);
  }

  const result = await pool.query(
    'DELETE FROM maintenance WHERE maintenance_id = $1 RETURNING maintenance_id',
    [maintenanceId]
  );

  return result.rows[0];
}

module.exports = {
  getAllMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  startMaintenance,
  completeMaintenance,
  deleteMaintenance,
};
