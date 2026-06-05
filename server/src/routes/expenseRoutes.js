const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');
const { validateExpense } = require('../middlewares/validation');

router.get('/', controller.getExpenses);
router.get('/stats', controller.getStats);
router.post('/', validateExpense, controller.createExpense);
router.put('/:id', validateExpense, controller.updateExpense);
router.delete('/:id', controller.deleteExpense);

module.exports = router;
