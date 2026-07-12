const { pool } = require('../config/db');
const AppError = require('../utils/AppError');

async function verifyForeignKeys(tripId, vehicleId) {
  if (tripId) {
    const result = await pool.query(
      'SELECT trip_id FROM trips WHERE trip_id = $1',
      [tripId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Invalid trip_id', 400);
    }
  }

  if (vehicleId) {
    const result = await pool.query(
      'SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1',
      [vehicleId]
    );

    if (result.rowCount === 0) {
      throw new AppError('Invalid vehicle_id', 400);
    }
  }
}

async function getAllExpenses() {
  const result = await pool.query(
    `SELECT e.*,
            t.source AS trip_source,
            t.destination AS trip_destination,
            v.registration_no AS vehicle_registration_no
     FROM expenses e
     LEFT JOIN trips t ON t.trip_id = e.trip_id
     LEFT JOIN vehicles v ON v.vehicle_id = e.vehicle_id
     ORDER BY e.expense_date DESC NULLS LAST`
  );
  return result.rows;
}

async function getExpenseById(expenseId) {
  const result = await pool.query(
    `SELECT e.*,
            t.source AS trip_source,
            t.destination AS trip_destination,
            v.registration_no AS vehicle_registration_no
     FROM expenses e
     LEFT JOIN trips t ON t.trip_id = e.trip_id
     LEFT JOIN vehicles v ON v.vehicle_id = e.vehicle_id
     WHERE e.expense_id = $1`,
    [expenseId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Expense not found', 404);
  }

  return result.rows[0];
}

async function createExpense(data) {
  const { trip_id, vehicle_id, expense_type, amount, remarks, expense_date } = data;

  if (amount === undefined || amount === null) {
    throw new AppError('amount is required', 400);
  }

  await verifyForeignKeys(trip_id, vehicle_id);

  const result = await pool.query(
    `INSERT INTO expenses (trip_id, vehicle_id, expense_type, amount, remarks, expense_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      trip_id ?? null,
      vehicle_id ?? null,
      expense_type ?? null,
      amount,
      remarks ?? null,
      expense_date ?? null,
    ]
  );

  return result.rows[0];
}

async function updateExpense(expenseId, data) {
  await getExpenseById(expenseId);

  if (data.trip_id !== undefined || data.vehicle_id !== undefined) {
    await verifyForeignKeys(data.trip_id, data.vehicle_id);
  }

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const allowedFields = ['trip_id', 'vehicle_id', 'expense_type', 'amount', 'remarks', 'expense_date'];

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

  values.push(expenseId);

  const result = await pool.query(
    `UPDATE expenses SET ${fields.join(', ')} WHERE expense_id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0];
}

async function deleteExpense(expenseId) {
  await getExpenseById(expenseId);

  const result = await pool.query(
    'DELETE FROM expenses WHERE expense_id = $1 RETURNING expense_id',
    [expenseId]
  );

  return result.rows[0];
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
