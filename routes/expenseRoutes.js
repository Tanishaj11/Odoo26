const express = require('express');
const {
<<<<<<< HEAD
  getAllExpenses,
  getExpenseById,
  createExpense,
=======
  createExpense,
  getAllExpenses,
  getExpenseById,
>>>>>>> backend-tanisha
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

<<<<<<< HEAD
router.get('/expenses', getAllExpenses);
router.get('/expenses/:expense_id', getExpenseById);
router.post('/expenses', createExpense);
=======
router.post('/expenses', createExpense);
router.get('/expenses', getAllExpenses);
router.get('/expenses/:expense_id', getExpenseById);
>>>>>>> backend-tanisha
router.put('/expenses/:expense_id', updateExpense);
router.delete('/expenses/:expense_id', deleteExpense);

module.exports = router;
