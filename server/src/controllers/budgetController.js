const db = require('../utils/dbHelper');

const getBudgets = async (req, res) => {
  try {
    const budgets = await db.readBudgets();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve budgets' });
  }
};

const updateBudgets = async (req, res) => {
  try {
    const newBudgets = req.body;
    await db.writeBudgets(newBudgets);
    res.json({ success: true, budgets: newBudgets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budgets' });
  }
};

module.exports = {
  getBudgets,
  updateBudgets
};
