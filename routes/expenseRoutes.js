const express = require('express');
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/expenses', getAllExpenses);
router.get('/expenses/:expense_id', getExpenseById);
router.post('/expenses', createExpense);
router.put('/expenses/:expense_id', updateExpense);
router.delete('/expenses/:expense_id', deleteExpense);

module.exports = router;
