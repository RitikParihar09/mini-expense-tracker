const db = require('../utils/dbHelper');

const getPrevMonthRange = (startStr, endStr) => {
  if (!startStr || !endStr) return { start: '', end: '' };
  const s = new Date(startStr);
  const e = new Date(endStr);
  
  const prevS = new Date(s.getFullYear(), s.getMonth() - 1, s.getDate());
  const prevE = new Date(e.getFullYear(), e.getMonth() - 1, e.getDate());
  
  const format = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return {
    start: format(prevS),
    end: format(prevE)
  };
};

const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let expenses = await db.readExpenses();

    // Filter by Category
    if (category && category !== 'All') {
      expenses = expenses.filter(e => e.category === category);
    }

    // Filter by Start Date
    if (startDate) {
      expenses = expenses.filter(e => e.date >= startDate);
    }

    // Filter by End Date
    if (endDate) {
      expenses = expenses.filter(e => e.date <= endDate);
    }

    // Sort descending by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

const getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await db.readExpenses();

    const start = startDate || '2026-06-01';
    const end = endDate || '2026-06-30';

    const currentExpenses = expenses.filter(e => e && e.date && e.date >= start && e.date <= end);

    const prevRange = getPrevMonthRange(start, end);
    const prevExpenses = expenses.filter(e => e && e.date && e.date >= prevRange.start && e.date <= prevRange.end);

    // Current metrics
    const totalSpentCurrent = currentExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const countCurrent = currentExpenses.length;

    // Previous metrics
    const totalSpentPrev = prevExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const countPrev = prevExpenses.length;

    // Changes
    let spentChange = 0;
    if (totalSpentPrev > 0) {
      spentChange = ((totalSpentCurrent - totalSpentPrev) / totalSpentPrev) * 100;
    } else if (totalSpentCurrent > 0) {
      spentChange = 100; // 100% increase when going from 0 to some spending
    }
    const countChange = countCurrent - countPrev;

    // Highest expense
    let highestSpent = 0;
    let highestDate = '';
    let highestDesc = '';
    currentExpenses.forEach(e => {
      if (e && typeof e.amount === 'number' && e.amount > highestSpent) {
        highestSpent = e.amount;
        highestDate = e.date;
        highestDesc = e.description;
      }
    });

    // Daily Average
    const startD = new Date(start);
    const endD = new Date(end);
    const diffTime = Math.abs(endD - startD);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const dailyAvg = totalSpentCurrent / (diffDays || 1);

    res.json({
      totalSpent: totalSpentCurrent,
      spentChange,
      totalCount: countCurrent,
      countChange,
      highestSpent,
      highestDate,
      highestDesc,
      dailyAvg
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute statistics' });
  }
};

const createExpense = async (req, res) => {
  try {
    const expenses = await db.readExpenses();
    const newExpense = {
      id: Date.now(),
      ...req.sanitizedExpense
    };

    expenses.unshift(newExpense); // Add to beginning
    await db.writeExpenses(expenses);

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseId = parseInt(id);
    const expenses = await db.readExpenses();

    const index = expenses.findIndex(e => e.id === expenseId);
    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updatedExpense = {
      id: expenseId,
      ...req.sanitizedExpense
    };

    expenses[index] = updatedExpense;
    await db.writeExpenses(expenses);

    res.json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseId = parseInt(id);
    const expenses = await db.readExpenses();

    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    if (expenses.length === updatedExpenses.length) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.writeExpenses(updatedExpenses);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  getExpenses,
  getStats,
  createExpense,
  updateExpense,
  deleteExpense
};
