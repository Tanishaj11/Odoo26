const express = require('express');
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/expenses', createExpense);
router.get('/expenses', getAllExpenses);
router.get('/expenses/:expense_id', getExpenseById);
router.put('/expenses/:expense_id', updateExpense);
router.delete('/expenses/:expense_id', deleteExpense);

module.exports = router;
