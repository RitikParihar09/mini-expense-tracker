const fs = require('fs').promises;
const path = require('path');

const EXPENSES_FILE = path.join(__dirname, '../../data/expenses.json');
const BUDGETS_FILE = path.join(__dirname, '../../data/budgets.json');

const DEFAULT_BUDGETS = {
  Food: 5000,
  Transport: 3000,
  Bills: 3000,
  Entertainment: 2000,
  Other: 1500
};

// Generates the exact 2026 mock data to seed on first run
const generateMockExpenses = () => {
  const list = [];
  
  // June 2026 (28 items, sum = 12540.50)
  list.push({ id: 1, date: '2026-06-03', description: 'Lunch with friends', category: 'Food', amount: 450.00, note: 'Pizza and drinks' });
  list.push({ id: 2, date: '2026-06-02', description: 'Metro Card Recharge', category: 'Transport', amount: 300.00, note: 'Monthly pass' });
  list.push({ id: 3, date: '2026-06-02', description: 'Electricity Bill', category: 'Bills', amount: 3200.00, note: 'May month bill' });
  list.push({ id: 4, date: '2026-06-01', description: 'Movie Ticket', category: 'Entertainment', amount: 450.00, note: 'Spider-Man movie' });
  list.push({ id: 5, date: '2026-06-01', description: 'Groceries', category: 'Food', amount: 780.50, note: 'Weekly groceries' });
  list.push({ id: 6, date: '2026-06-03', description: 'Office lunch', category: 'Food', amount: 400.00, note: '' });
  list.push({ id: 7, date: '2026-06-02', description: 'Dinner Date', category: 'Food', amount: 1500.00, note: 'Fine dining' });
  list.push({ id: 8, date: '2026-06-02', description: 'Morning Coffee', category: 'Food', amount: 150.00, note: 'Starbucks' });
  list.push({ id: 9, date: '2026-06-01', description: 'Snacks & Ice Cream', category: 'Food', amount: 500.00, note: '' });
  list.push({ id: 10, date: '2026-06-01', description: 'Organic Fruits', category: 'Food', amount: 400.00, note: '' });
  list.push({ id: 11, date: '2026-06-01', description: 'Juice Bar', category: 'Food', amount: 69.50, note: '' });
  list.push({ id: 12, date: '2026-06-03', description: 'Cab Ride to Office', category: 'Transport', amount: 350.00, note: 'Uber' });
  list.push({ id: 13, date: '2026-06-02', description: 'Weekly Fuel refill', category: 'Transport', amount: 1000.00, note: 'Petrol' });
  list.push({ id: 14, date: '2026-06-01', description: 'Highway Toll', category: 'Transport', amount: 200.00, note: '' });
  list.push({ id: 15, date: '2026-06-01', description: 'Airport Shuttle', category: 'Transport', amount: 300.00, note: '' });
  list.push({ id: 16, date: '2026-06-02', description: 'Netflix subscription', category: 'Entertainment', amount: 400.00, note: 'Premium UHD' });
  list.push({ id: 17, date: '2026-06-02', description: 'Concert Ticket', category: 'Entertainment', amount: 600.00, note: 'Local band' });
  list.push({ id: 18, date: '2026-06-01', description: 'Gaming Arcade', category: 'Entertainment', amount: 200.00, note: 'Timezone' });
  list.push({ id: 19, date: '2026-06-03', description: 'Haircut & Grooming', category: 'Other', amount: 350.00, note: '' });
  list.push({ id: 20, date: '2026-06-03', description: 'Notebooks', category: 'Other', amount: 100.00, note: 'Stationery' });
  list.push({ id: 21, date: '2026-06-02', description: 'Gift for mom', category: 'Other', amount: 500.00, note: 'Flowers' });
  list.push({ id: 22, date: '2026-06-02', description: 'Laundry service', category: 'Other', amount: 120.00, note: '' });
  list.push({ id: 23, date: '2026-06-02', description: 'Gym Shaker Bottle', category: 'Other', amount: 100.00, note: '' });
  list.push({ id: 24, date: '2026-06-01', description: 'Key Ring', category: 'Other', amount: 20.50, note: '' });
  list.push({ id: 25, date: '2026-06-01', description: 'Mobile cover', category: 'Other', amount: 50.00, note: '' });
  list.push({ id: 26, date: '2026-06-01', description: 'Shoe polish', category: 'Other', amount: 30.00, note: '' });
  list.push({ id: 27, date: '2026-06-01', description: 'New socks', category: 'Other', amount: 10.00, note: '' });
  list.push({ id: 28, date: '2026-06-01', description: 'Postage stamps', category: 'Other', amount: 10.00, note: '' });

  // May 2026 (23 items, sum = 10609.56)
  list.push({ id: 101, date: '2026-05-15', description: 'House Rent', category: 'Bills', amount: 8000.00, note: 'Monthly rent' });
  list.push({ id: 102, date: '2026-05-20', description: 'Weekly Groceries', category: 'Food', amount: 1500.00, note: '' });
  list.push({ id: 103, date: '2026-05-22', description: 'Car Fuel refill', category: 'Transport', amount: 800.00, note: '' });
  list.push({ id: 104, date: '2026-05-25', description: 'Fast Food Dinner', category: 'Food', amount: 214.56, note: '' });
  
  for (let i = 105; i <= 123; i++) {
    list.push({
      id: i,
      date: `2026-05-${String(i - 100).padStart(2, '0')}`,
      description: `Small Purchase ${i - 104}`,
      category: 'Other',
      amount: 5.00,
      note: ''
    });
  }

  return list;
};

// Ensure data folder exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(EXPENSES_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Already exists
  }
};

const readExpenses = async () => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(EXPENSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // File doesn't exist, create it with seeds
    const mockData = generateMockExpenses();
    await fs.writeFile(EXPENSES_FILE, JSON.stringify(mockData, null, 2), 'utf8');
    return mockData;
  }
};

const writeExpenses = async (expenses) => {
  await ensureDataDir();
  await fs.writeFile(EXPENSES_FILE, JSON.stringify(expenses, null, 2), 'utf8');
};

const readBudgets = async () => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(BUDGETS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // File doesn't exist, create with defaults
    await fs.writeFile(BUDGETS_FILE, JSON.stringify(DEFAULT_BUDGETS, null, 2), 'utf8');
    return DEFAULT_BUDGETS;
  }
};

const writeBudgets = async (budgets) => {
  await ensureDataDir();
  await fs.writeFile(BUDGETS_FILE, JSON.stringify(budgets, null, 2), 'utf8');
};

module.exports = {
  readExpenses,
  writeExpenses,
  readBudgets,
  writeBudgets
};
