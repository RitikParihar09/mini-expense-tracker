const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetController');
const { validateBudgets } = require('../middlewares/validation');

router.get('/', controller.getBudgets);
router.put('/', validateBudgets, controller.updateBudgets);

module.exports = router;
