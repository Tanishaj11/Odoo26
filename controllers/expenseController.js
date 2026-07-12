<<<<<<< HEAD
const expenseService = require('../services/expenseService');
const asyncHandler = require('../utils/asyncHandler');

const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getAllExpenses();
  res.status(200).json({ status: 'OK', data: expenses });
});

const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.expense_id);
  res.status(200).json({ status: 'OK', data: expense });
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  res.status(201).json({ status: 'OK', message: 'Expense created successfully', data: expense });
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.expense_id, req.body);
  res.status(200).json({ status: 'OK', message: 'Expense updated successfully', data: expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.expense_id);
  res.status(200).json({ status: 'OK', message: 'Expense deleted successfully' });
});

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
=======
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Create Expense
const createExpense = asyncHandler(async (req, res) => {
  const {
    trip_id,
    vehicle_id,
    expense_type,
    amount,
    remarks,
    expense_date
  } = req.body;

  if (!expense_type || amount === undefined || !expense_date) {
    throw new AppError('expense_type, amount, and expense_date are required', 400);
  }

  // Verify trip if provided
  if (trip_id) {
    const tRes = await pool.query('SELECT trip_id FROM trips WHERE trip_id = $1', [trip_id]);
    if (tRes.rowCount === 0) {
      throw new AppError('Trip not found', 400);
    }
  }

  // Verify vehicle if provided
  if (vehicle_id) {
    const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
    if (vRes.rowCount === 0) {
      throw new AppError('Vehicle not found', 400);
    }
  }

  const query = `
    INSERT INTO expenses (
      trip_id, vehicle_id, expense_type, amount, remarks, expense_date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    trip_id || null,
    vehicle_id || null,
    expense_type,
    amount,
    remarks ? remarks.trim() : null,
    expense_date
  ];

  const result = await pool.query(query, values);

  res.status(201).json({
    status: 'OK',
    message: 'Expense record created successfully',
    data: result.rows[0],
  });
});

// Get All Expenses
const getAllExpenses = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');

  res.status(200).json({
    status: 'OK',
    data: result.rows,
  });
});

// Get Expense By ID
const getExpenseById = asyncHandler(async (req, res) => {
  const { expense_id } = req.params;

  const result = await pool.query('SELECT * FROM expenses WHERE expense_id = $1', [expense_id]);

  if (result.rowCount === 0) {
    throw new AppError('Expense record not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

// Update Expense
const updateExpense = asyncHandler(async (req, res) => {
  const { expense_id } = req.params;
  const {
    trip_id,
    vehicle_id,
    expense_type,
    amount,
    remarks,
    expense_date
  } = req.body;

  if (!expense_type || amount === undefined || !expense_date) {
    throw new AppError('expense_type, amount, and expense_date are required', 400);
  }

  // Verify expense exists
  const currentResult = await pool.query('SELECT * FROM expenses WHERE expense_id = $1', [expense_id]);
  if (currentResult.rowCount === 0) {
    throw new AppError('Expense record not found', 404);
  }

  // Verify trip if provided
  if (trip_id) {
    const tRes = await pool.query('SELECT trip_id FROM trips WHERE trip_id = $1', [trip_id]);
    if (tRes.rowCount === 0) {
      throw new AppError('Trip not found', 400);
    }
  }

  // Verify vehicle if provided
  if (vehicle_id) {
    const vRes = await pool.query('SELECT vehicle_id FROM vehicles WHERE vehicle_id = $1', [vehicle_id]);
    if (vRes.rowCount === 0) {
      throw new AppError('Vehicle not found', 400);
    }
  }

  const query = `
    UPDATE expenses
    SET trip_id = $1,
        vehicle_id = $2,
        expense_type = $3,
        amount = $4,
        remarks = $5,
        expense_date = $6
    WHERE expense_id = $7
    RETURNING *
  `;

  const values = [
    trip_id || null,
    vehicle_id || null,
    expense_type,
    amount,
    remarks ? remarks.trim() : null,
    expense_date,
    expense_id
  ];

  const result = await pool.query(query, values);

  res.status(200).json({
    status: 'OK',
    message: 'Expense record updated successfully',
    data: result.rows[0],
  });
});

// Delete Expense
const deleteExpense = asyncHandler(async (req, res) => {
  const { expense_id } = req.params;

  const result = await pool.query('DELETE FROM expenses WHERE expense_id = $1 RETURNING expense_id', [expense_id]);

  if (result.rowCount === 0) {
    throw new AppError('Expense record not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Expense record deleted successfully',
  });
});

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
>>>>>>> backend-tanisha
  updateExpense,
  deleteExpense,
};
