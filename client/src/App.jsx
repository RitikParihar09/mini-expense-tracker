import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import CategorySummary from './components/CategorySummary';
import ExpenseTable from './components/ExpenseTable';
import ExpenseForm from './components/ExpenseForm';
import BudgetModal from './components/BudgetModal';
import { exportToCSV } from './utils/helpers';
import { AlertTriangle, User, Save, PieChart, Calendar, X } from 'lucide-react';
import avatar from './assets/avatar.png';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// Helper to generate the exact mock expenses
const generateMockExpenses = () => {
  const list = [];
  
  // 1. June 2025 Expenses (28 items, sum = 12540.50)
  // Visible items in the table
  list.push({ id: 1, date: '2025-06-03', description: 'Lunch with friends', category: 'Food', amount: 450.00, note: 'Pizza and drinks' });
  list.push({ id: 2, date: '2025-06-02', description: 'Metro Card Recharge', category: 'Transport', amount: 300.00, note: 'Monthly pass' });
  list.push({ id: 3, date: '2025-06-02', description: 'Electricity Bill', category: 'Bills', amount: 3200.00, note: 'May month bill' });
  list.push({ id: 4, date: '2025-06-01', description: 'Movie Ticket', category: 'Entertainment', amount: 450.00, note: 'Spider-Man movie' });
  list.push({ id: 5, date: '2025-06-01', description: 'Groceries', category: 'Food', amount: 780.50, note: 'Weekly groceries' });

  // Other June 2025 items to reach exactly 28 items and specific category sums:
  // Food target: 4250. Current: 450 + 780.50 = 1230.50. Remaining: 3019.50 (6 items)
  list.push({ id: 6, date: '2025-06-03', description: 'Office lunch', category: 'Food', amount: 400.00, note: '' });
  list.push({ id: 7, date: '2025-06-02', description: 'Dinner Date', category: 'Food', amount: 1500.00, note: 'Fine dining' });
  list.push({ id: 8, date: '2025-06-02', description: 'Morning Coffee', category: 'Food', amount: 150.00, note: 'Starbucks' });
  list.push({ id: 9, date: '2025-06-01', description: 'Snacks & Ice Cream', category: 'Food', amount: 500.00, note: '' });
  list.push({ id: 10, date: '2025-06-01', description: 'Organic Fruits', category: 'Food', amount: 400.00, note: '' });
  list.push({ id: 11, date: '2025-06-01', description: 'Juice Bar', category: 'Food', amount: 69.50, note: '' }); // Food total = 4250.00

  // Transport target: 2150. Current: 300. Remaining: 1850 (4 items)
  list.push({ id: 12, date: '2025-06-03', description: 'Cab Ride to Office', category: 'Transport', amount: 350.00, note: 'Uber' });
  list.push({ id: 13, date: '2025-06-02', description: 'Weekly Fuel refill', category: 'Transport', amount: 1000.00, note: 'Petrol' });
  list.push({ id: 14, date: '2025-06-01', description: 'Highway Toll', category: 'Transport', amount: 200.00, note: '' });
  list.push({ id: 15, date: '2025-06-01', description: 'Airport Shuttle', category: 'Transport', amount: 300.00, note: '' }); // Transport total = 2150.00

  // Bills target: 3200. Current: 3200. Remaining: 0 (0 items)
  // (Bills total = 3200.00)

  // Entertainment target: 1650. Current: 450. Remaining: 1200 (3 items)
  list.push({ id: 16, date: '2025-06-02', description: 'Netflix subscription', category: 'Entertainment', amount: 400.00, note: 'Premium UHD' });
  list.push({ id: 17, date: '2025-06-02', description: 'Concert Ticket', category: 'Entertainment', amount: 600.00, note: 'Local band' });
  list.push({ id: 18, date: '2025-06-01', description: 'Gaming Arcade', category: 'Entertainment', amount: 200.00, note: 'Timezone' }); // Entertainment total = 1650.00

  // Other target: 1290.50. Remaining: 1290.50 (10 items)
  list.push({ id: 19, date: '2025-06-03', description: 'Haircut & Grooming', category: 'Other', amount: 350.00, note: '' });
  list.push({ id: 20, date: '2025-06-03', description: 'Notebooks', category: 'Other', amount: 100.00, note: 'Stationery' });
  list.push({ id: 21, date: '2025-06-02', description: 'Gift for mom', category: 'Other', amount: 500.00, note: 'Flowers' });
  list.push({ id: 22, date: '2025-06-02', description: 'Laundry service', category: 'Other', amount: 120.00, note: '' });
  list.push({ id: 23, date: '2025-06-02', description: 'Gym Shaker Bottle', category: 'Other', amount: 100.00, note: '' });
  list.push({ id: 24, date: '2025-06-01', description: 'Key Ring', category: 'Other', amount: 20.50, note: '' });
  list.push({ id: 25, date: '2025-06-01', description: 'Mobile cover', category: 'Other', amount: 50.00, note: '' });
  list.push({ id: 26, date: '2025-06-01', description: 'Shoe polish', category: 'Other', amount: 30.00, note: '' });
  list.push({ id: 27, date: '2025-06-01', description: 'New socks', category: 'Other', amount: 10.00, note: '' });
  list.push({ id: 28, date: '2025-06-01', description: 'Postage stamps', category: 'Other', amount: 10.00, note: '' }); // Other total = 1290.50

  // Total June count: 28. Total June spend: 12540.50

  // 2. May 2025 Expenses (23 items, sum = 10609.56)
  // Let's add 23 items in May so that the trend shows exactly +5 count, and +18.2% spent.
  list.push({ id: 101, date: '2025-05-15', description: 'House Rent', category: 'Bills', amount: 8000.00, note: 'Monthly rent' });
  list.push({ id: 102, date: '2025-05-20', description: 'Weekly Groceries', category: 'Food', amount: 1500.00, note: '' });
  list.push({ id: 103, date: '2025-05-22', description: 'Car Fuel refill', category: 'Transport', amount: 800.00, note: '' });
  list.push({ id: 104, date: '2025-05-25', description: 'Fast Food Dinner', category: 'Food', amount: 209.56, note: '' });
  
  // 19 small items to make up 23 items total in May
  for (let i = 105; i <= 123; i++) {
    list.push({
      id: i,
      date: `2025-05-${String(i - 100).padStart(2, '0')}`,
      description: `Small Purchase ${i - 104}`,
      category: 'Other',
      amount: 5.00, // Very small purchases
      note: ''
    });
  }
  // Total May spend = 8000 + 1500 + 800 + 209.56 + (19 * 5) = 10604.56 + 95 = 10699.56.
  // Wait, let's adjust May spend to match exactly 10609.56:
  // May target = 10609.56. 
  // Let's change item 104 amount: 10609.56 - 8000 - 1500 - 800 - 95 = 214.56.
  list[list.length - 20].amount = 214.56; // set item 104 amount
  
  return list;
};

const DEFAULT_BUDGETS = {
  Food: 5000,
  Transport: 3000,
  Bills: 3000, // Spent is 3200, so it will exceed and trigger warning!
  Entertainment: 2000,
  Other: 1500
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-03');
  const [timePeriod, setTimePeriod] = useState('this-month'); // for category chart filter
  const [dismissedWarnings, setDismissedWarnings] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Budgets configuration inputs
  const [tempBudgets, setTempBudgets] = useState({});

  // 1. Initial Data Loading
  useEffect(() => {
    const localExpenses = localStorage.getItem('expenses');
    const localBudgets = localStorage.getItem('budgets');

    let validExpensesLoaded = false;
    if (localExpenses) {
      try {
        const parsed = JSON.parse(localExpenses);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(e => e && e.date && e.category && typeof e.amount === 'number')) {
          setExpenses(parsed);
          validExpensesLoaded = true;
        }
      } catch (err) {
        console.error('Failed to parse local expenses', err);
      }
    }

    if (!validExpensesLoaded) {
      const mock = generateMockExpenses();
      setExpenses(mock);
      localStorage.setItem('expenses', JSON.stringify(mock));
    }

    let validBudgetsLoaded = false;
    if (localBudgets) {
      try {
        const parsed = JSON.parse(localBudgets);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
          setBudgets(parsed);
          setTempBudgets(parsed);
          validBudgetsLoaded = true;
        }
      } catch (err) {
        console.error('Failed to parse local budgets', err);
      }
    }

    if (!validBudgetsLoaded) {
      setBudgets(DEFAULT_BUDGETS);
      setTempBudgets(DEFAULT_BUDGETS);
      localStorage.setItem('budgets', JSON.stringify(DEFAULT_BUDGETS));
    }
  }, []);

  // 2. Persist Data changes
  const saveExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const saveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
    setDismissedWarnings([]); // Clear dismissed warnings on budget limit updates
  };

  // 3. CRUD Operations
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now() // Simple unique numeric ID
    };
    const updated = [newExpense, ...expenses];
    saveExpenses(updated);
    setIsFormOpen(false);
  };

  const handleEditExpense = (expenseData) => {
    const updated = expenses.map(exp => exp.id === expenseData.id ? expenseData : exp);
    saveExpenses(updated);
    setEditingExpense(null);
    setIsFormOpen(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updated = expenses.filter(exp => exp.id !== id);
      saveExpenses(updated);
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleCsvExport = () => {
    // Export expenses that match the table filters
    let filtered = [...expenses];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    if (startDate) {
      filtered = filtered.filter(e => e.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(e => e.date <= endDate);
    }
    
    // Sort descending by date (newest first) for output consistency
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    exportToCSV(filtered);
  };

  // 4. Calculations & Stats
  // We compute statistics for "This Month" (June 2025) and "Last Month" (May 2025)
  const getStats = () => {
    const juneExpenses = expenses.filter(e => e && e.date && typeof e.date === 'string' && e.date.startsWith('2025-06'));
    const mayExpenses = expenses.filter(e => e && e.date && typeof e.date === 'string' && e.date.startsWith('2025-05'));

    // June spent
    const totalSpentJune = juneExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const countJune = juneExpenses.length;

    // May spent
    const totalSpentMay = mayExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const countMay = mayExpenses.length;

    // Spent % change: ((June - May) / May) * 100
    let spentChange = 0;
    if (totalSpentMay > 0) {
      spentChange = ((totalSpentJune - totalSpentMay) / totalSpentMay) * 100;
    }

    // Count change: June - May
    const countChange = countJune - countMay;

    // Highest expense in June
    let highestSpent = 0;
    let highestDate = '';
    juneExpenses.forEach(e => {
      if (e && typeof e.amount === 'number' && e.amount > highestSpent) {
        highestSpent = e.amount;
        highestDate = e.date;
      }
    });

    // Daily Average: June spent / 30 days
    const dailyAvg = totalSpentJune / 30;

    return {
      totalSpent: totalSpentJune,
      spentChange,
      totalCount: countJune,
      countChange,
      highestSpent,
      highestDate,
      dailyAvg
    };
  };

  const stats = getStats();

  // Calculate totals per category based on Category Chart timePeriod selection
  const getCategoryChartData = () => {
    let filtered = expenses.filter(e => e && e.date && typeof e.date === 'string');
    if (timePeriod === 'this-month') {
      filtered = filtered.filter(e => e.date.startsWith('2025-06'));
    } else if (timePeriod === 'last-month') {
      filtered = filtered.filter(e => e.date.startsWith('2025-05'));
    }

    // Calculate sums
    const sums = { Food: 0, Transport: 0, Bills: 0, Entertainment: 0, Other: 0 };
    filtered.forEach(e => {
      if (e && e.category && sums[e.category] !== undefined) {
        sums[e.category] += (Number(e.amount) || 0);
      }
    });

    return CATEGORIES.map(cat => ({
      category: cat,
      amount: sums[cat]
    }));
  };

  const categoryChartData = getCategoryChartData();

  // Find exceeded budgets for warning banners
  // Exceeded budgets are checked against current month's expenses
  const exceededBudgets = CATEGORIES.map(cat => {
    const juneSpentInCat = expenses
      .filter(e => e && e.date && typeof e.date === 'string' && e.date.startsWith('2025-06') && e.category === cat)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const limit = budgets[cat] || 0;
    return {
      category: cat,
      spent: juneSpentInCat,
      limit,
      exceeded: juneSpentInCat > limit,
      diff: juneSpentInCat - limit
    };
  }).filter(b => b.exceeded);

  // Handle saving budgets configuration
  const handleSaveBudgets = (e) => {
    e.preventDefault();
    const newBudgets = {};
    CATEGORIES.forEach(cat => {
      newBudgets[cat] = Math.max(0, parseFloat(tempBudgets[cat]) || 0);
    });
    saveBudgets(newBudgets);
    alert('Budgets updated successfully!');
    setActiveTab('dashboard');
  };

  const handleBudgetInputChange = (cat, val) => {
    setTempBudgets(prev => ({
      ...prev,
      [cat]: val
    }));
  };

  return (
    <div className="app-container">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddExpenseClick={openAddModal}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header-section">
          <div className="header-left">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'expenses' && 'All Expenses'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Overview of your expenses'}
              {activeTab === 'expenses' && 'Detailed log of your spending'}
            </p>
          </div>

          <div className="header-right">
            <button className="date-filter-btn">
              <Calendar size={16} />
              <span>This Month (Jun 1 - Jun 3)</span>
            </button>

            <div className="profile-dropdown-container" ref={profileMenuRef}>
              <img
                src={avatar}
                alt="User Profile"
                className="user-avatar"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ cursor: 'pointer' }}
              />

              {showProfileMenu && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-user-info">
                    <span className="profile-dropdown-name">Ritik Parihar</span>
                    <span className="profile-dropdown-email">ritikparihar09@gmail.com</span>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <div className="profile-dropdown-role">Administrator</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        {activeTab === 'dashboard' && (
          <>
            {/* Budget warnings if any */}
            {exceededBudgets
              .filter(b => !dismissedWarnings.includes(b.category))
              .map(b => (
                <div key={b.category} className="budget-warning-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <AlertTriangle className="budget-warning-icon" />
                    <div className="budget-warning-details">
                      <span className="budget-warning-title">Budget Limit Exceeded!</span>
                      <span className="budget-warning-desc">
                        Your spending in <strong>{b.category}</strong> (₹{b.spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) has exceeded your monthly budget of ₹{b.limit.toLocaleString('en-IN', { minimumFractionDigits: 2 })} by <strong>₹{b.diff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>!
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissedWarnings(prev => [...prev, b.category])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d97706',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      borderRadius: 'var(--radius-full)',
                      transition: 'background-color 0.2s'
                    }}
                    title="Dismiss warning"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            }

            {/* KPI Summary Cards */}
            <SummaryCards stats={stats} />

            {/* Middle Section: Chart + Progress Summary */}
            <div className="dashboard-middle-grid">
              <CategoryChart
                data={categoryChartData}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
              />
              <CategorySummary data={categoryChartData} onEditBudgetClick={() => setIsBudgetModalOpen(true)} />
            </div>

            {/* Bottom Section: Recent Expenses Table */}
            <ExpenseTable
              expenses={expenses}
              onEditExpense={openEditModal}
              onDeleteExpense={handleDeleteExpense}
              onAddExpenseClick={openAddModal}
              onExportCsvClick={handleCsvExport}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              startDate={startDate}
              endDate={endDate}
              setDateRange={handleDateRangeChange}
              categories={CATEGORIES}
            />
          </>
        )}

        {activeTab === 'expenses' && (
          <ExpenseTable
            expenses={expenses}
            onEditExpense={openEditModal}
            onDeleteExpense={handleDeleteExpense}
            onAddExpenseClick={openAddModal}
            onExportCsvClick={handleCsvExport}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            startDate={startDate}
            endDate={endDate}
            setDateRange={handleDateRangeChange}
            categories={CATEGORIES}
          />
        )}

        {/* Global Footer */}
        <footer className="footer-text">
          &copy; 2025 Expense Tracker. All rights reserved.
        </footer>
      </main>

      {/* Add / Edit Form Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
        expense={editingExpense}
        categories={CATEGORIES}
      />

      {/* Set Monthly Budgets Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSave={saveBudgets}
        categories={CATEGORIES}
      />
    </div>
  );
};

export default App;
