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
  updateExpense,
  deleteExpense,
};
