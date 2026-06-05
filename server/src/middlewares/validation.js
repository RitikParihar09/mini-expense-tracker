const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const validateExpense = (req, res, next) => {
  const { date, description, category, amount, note } = req.body;

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Date is required and must be a valid date format' });
  }

  // Ensure not in future
  const selectedDate = new Date(date);
  const today = new Date();
  // Clear times for date comparison
  selectedDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  if (selectedDate > today) {
    return res.status(400).json({ error: 'Date cannot be in the future' });
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'Description is required' });
  }
  if (description.length > 100) {
    return res.status(400).json({ error: 'Description must be 100 characters or less' });
  }

  if (!category || !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Category is required and must be one of: ${CATEGORIES.join(', ')}` });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Amount is required and must be a positive number' });
  }

  // Attach sanitized data to request
  req.sanitizedExpense = {
    date,
    description: description.trim(),
    category,
    amount: parsedAmount,
    note: (note || '').trim()
  };

  next();
};

const validateBudgets = (req, res, next) => {
  const budgets = req.body;
  if (!budgets || typeof budgets !== 'object' || Array.isArray(budgets)) {
    return res.status(400).json({ error: 'Invalid budgets payload' });
  }

  const errors = [];
  CATEGORIES.forEach(cat => {
    if (budgets[cat] !== undefined) {
      const val = parseFloat(budgets[cat]);
      if (isNaN(val) || val < 0) {
        errors.push(`Budget for ${cat} must be a non-negative number`);
      }
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

module.exports = {
  validateExpense,
  validateBudgets
};
