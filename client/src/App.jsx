import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import CategorySummary from './components/CategorySummary';
import ExpenseTable from './components/ExpenseTable';
import DailyTrendChart from './components/DailyTrendChart';
import ExpenseForm from './components/ExpenseForm';
import BudgetModal from './components/BudgetModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { exportToCSV, formatDate } from './utils/helpers';
import { AlertTriangle, User, Save, PieChart, Calendar, X, ChevronDown, Check, Menu, Utensils, Car, FileText, Gamepad2, MoreHorizontal } from 'lucide-react';
import avatar from './assets/avatar.png';
import * as api from './utils/api';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

const CATEGORY_META = {
  Food: { icon: Utensils, bgColor: 'var(--color-food-light)', iconColor: 'var(--color-food-text)' },
  Transport: { icon: Car, bgColor: 'var(--color-transport-light)', iconColor: 'var(--color-transport-text)' },
  Bills: { icon: FileText, bgColor: 'var(--color-bills-light)', iconColor: 'var(--color-bills-text)' },
  Entertainment: { icon: Gamepad2, bgColor: 'var(--color-entertainment-light)', iconColor: 'var(--color-entertainment-text)' },
  Other: { icon: MoreHorizontal, bgColor: 'var(--color-other-light)', iconColor: 'var(--color-other-text)' }
};



const DEFAULT_BUDGETS = {
  Food: 5000,
  Transport: 3000,
  Bills: 3000, // Spent is 3200, so it will exceed and trigger warning!
  Entertainment: 2000,
  Other: 1500
};

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

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [stats, setStats] = useState({
    totalSpent: 0,
    spentChange: 0,
    totalCount: 0,
    countChange: 0,
    highestSpent: 0,
    highestDate: '',
    dailyAvg: 0
  });

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timePeriod, setTimePeriod] = useState('this-month'); // for category chart filter
  const [dismissedWarnings, setDismissedWarnings] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Dashboard-specific Date Filter State
  const [dashStartDate, setDashStartDate] = useState('2026-06-01');
  const [dashEndDate, setDashEndDate] = useState('2026-06-30');
  const [showDashDatePopover, setShowDashDatePopover] = useState(false);
  const dashDatePopoverRef = useRef(null);
  const [tempDashStartDate, setTempDashStartDate] = useState('2026-06-01');
  const [tempDashEndDate, setTempDashEndDate] = useState('2026-06-30');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (dashDatePopoverRef.current && !dashDatePopoverRef.current.contains(event.target)) {
        setShowDashDatePopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Budgets configuration inputs
  const [tempBudgets, setTempBudgets] = useState({});

  // 1. Initial Data Loading & Syncing
  const loadData = async () => {
    try {
      const expensesData = await api.fetchExpenses();
      setExpenses(expensesData);

      const budgetsData = await api.fetchBudgets();
      setBudgets(budgetsData);
      setTempBudgets(budgetsData);
    } catch (err) {
      console.error('Failed to load data from server', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveBudgets = async (newBudgets) => {
    try {
      const result = await api.updateBudgets(newBudgets);
      setBudgets(result.budgets);
      setTempBudgets(result.budgets);
      setDismissedWarnings([]); // Clear dismissed warnings on budget limit updates
      setToast({ message: 'Budgets updated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to save budgets', type: 'error' });
    }
  };

  // 3. CRUD Operations
  const handleAddExpense = async (expenseData) => {
    try {
      await api.createExpense(expenseData);
      await loadData();
      setIsFormOpen(false);
      setToast({ message: 'Expense added successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to add expense', type: 'error' });
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      await api.updateExpense(expenseData.id, expenseData);
      await loadData();
      setEditingExpense(null);
      setIsFormOpen(false);
      setToast({ message: 'Expense updated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update expense', type: 'error' });
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenseToDelete(id);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await api.deleteExpense(expenseToDelete);
      await loadData();
      setExpenseToDelete(null);
      setToast({ message: 'Expense deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete expense', type: 'error' });
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

  const getDashDateLabel = () => {
    if (dashStartDate === '2026-06-01' && dashEndDate === '2026-06-30') {
      return 'This Month (Jun 1 - Jun 30, 2026)';
    }
    if (dashStartDate === '2026-05-01' && dashEndDate === '2026-05-31') {
      return 'Last Month (May 1 - May 31, 2026)';
    }
    if (!dashStartDate && !dashEndDate) {
      return 'All Time';
    }
    return `${formatDate(dashStartDate)} - ${formatDate(dashEndDate)}`;
  };

  // 4. Calculations & Stats
  // Fetch statistics from Express backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await api.fetchStats(dashStartDate, dashEndDate);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    loadStats();
  }, [dashStartDate, dashEndDate, expenses]);

  // Calculate totals per category based on selected dashboard date range
  const getCategoryChartData = () => {
    const filtered = expenses.filter(e => {
      if (!e || !e.date || typeof e.date !== 'string') return false;
      if (dashStartDate && e.date < dashStartDate) return false;
      if (dashEndDate && e.date > dashEndDate) return false;
      return true;
    });

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

  // Find exceeded budgets for warning banners dynamically based on selected date filters
  const exceededBudgets = CATEGORIES.map(cat => {
    const spentInCat = expenses
      .filter(e => {
        if (!e || !e.date || typeof e.date !== 'string') return false;
        if (e.category !== cat) return false;
        if (dashStartDate && e.date < dashStartDate) return false;
        if (dashEndDate && e.date > dashEndDate) return false;
        return true;
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const limit = budgets[cat] || 0;
    return {
      category: cat,
      spent: spentInCat,
      limit,
      exceeded: spentInCat > limit,
      diff: spentInCat - limit
    };
  }).filter(b => b.exceeded);

  const activeExceeded = exceededBudgets.filter(b => !dismissedWarnings.includes(b.category));

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
      {/* Background Glassmorphism Blobs Container */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
        <div className="bg-glass-blob blob-1"></div>
        <div className="bg-glass-blob blob-2"></div>
        <div className="bg-glass-blob blob-3"></div>
      </div>

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddExpenseClick={openAddModal}
        theme={theme}
        setTheme={setTheme}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      {isMobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header-section">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-toggle-btn" onClick={() => setIsMobileSidebarOpen(true)} title="Open navigation Menu">
              <Menu size={22} />
            </button>
            <div className="header-titles">
              <h1 style={{ margin: 0 }}>
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'expenses' && 'All Expenses'}
              </h1>
              <p style={{ margin: '2px 0 0 0' }}>
                {activeTab === 'dashboard' && 'Overview of your expenses'}
                {activeTab === 'expenses' && 'Detailed log of your spending'}
              </p>
            </div>
          </div>

          <div className="header-right">
            {activeTab === 'dashboard' && (
              <div className="profile-dropdown-container" ref={dashDatePopoverRef}>
                <button
                  className="date-filter-btn"
                  onClick={() => setShowDashDatePopover(!showDashDatePopover)}
                >
                  <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span className="date-filter-label">{getDashDateLabel()}</span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </button>

                {showDashDatePopover && (
                  <div className="custom-date-popover" style={{ right: 0, top: 'calc(100% + 8px)', width: '220px' }}>
                    <button
                      className={`date-preset-btn ${dashStartDate === '2026-06-01' && dashEndDate === '2026-06-30' ? 'active' : ''}`}
                      onClick={() => {
                        setDashStartDate('2026-06-01');
                        setDashEndDate('2026-06-30');
                        setShowDashDatePopover(false);
                      }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', width: '-webkit-fill-available' }}
                    >
                      <span>This Month</span>
                      {dashStartDate === '2026-06-01' && dashEndDate === '2026-06-30' && <Check size={14} style={{ color: 'var(--text-active)' }} />}
                    </button>
                    <button
                      className={`date-preset-btn ${dashStartDate === '2026-05-01' && dashEndDate === '2026-05-31' ? 'active' : ''}`}
                      onClick={() => {
                        setDashStartDate('2026-05-01');
                        setDashEndDate('2026-05-31');
                        setShowDashDatePopover(false);
                      }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', width: '-webkit-fill-available' }}
                    >
                      <span>Last Month</span>
                      {dashStartDate === '2026-05-01' && dashEndDate === '2026-05-31' && <Check size={14} style={{ color: 'var(--text-active)' }} />}
                    </button>
                    <button
                      className={`date-preset-btn ${!dashStartDate && !dashEndDate ? 'active' : ''}`}
                      onClick={() => {
                        setDashStartDate('');
                        setDashEndDate('');
                        setShowDashDatePopover(false);
                      }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', width: '-webkit-fill-available' }}
                    >
                      <span>All Time</span>
                      {!dashStartDate && !dashEndDate && <Check size={14} style={{ color: 'var(--text-active)' }} />}
                    </button>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setDashStartDate(tempDashStartDate);
                        setDashEndDate(tempDashEndDate);
                        setShowDashDatePopover(false);
                      }}
                      className="custom-date-inputs"
                      style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}
                    >
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Custom Range</label>
                      <div className="custom-date-row" style={{ marginBottom: '6px' }}>
                        <input
                          type="date"
                          value={tempDashStartDate}
                          onChange={(e) => setTempDashStartDate(e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div className="custom-date-row" style={{ marginBottom: '8px' }}>
                        <input
                          type="date"
                          value={tempDashEndDate}
                          onChange={(e) => setTempDashEndDate(e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div className="custom-date-popover-actions">
                        <button
                          type="button"
                          className="date-popover-btn modal-btn-cancel"
                          onClick={() => setShowDashDatePopover(false)}
                          style={{ padding: '4px 8px' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="date-popover-btn modal-btn-submit"
                          style={{ padding: '4px 8px' }}
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

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
                    <span className="profile-dropdown-email">ritikparihar2040@gmail.com</span>
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
            {/* KPI Summary Cards */}
            <SummaryCards stats={stats} isAllTime={!dashStartDate && !dashEndDate} />

            {/* Middle Section: Chart + Progress Summary */}
            <div className="dashboard-middle-grid">
              <CategoryChart
                data={categoryChartData}
              />
              <CategorySummary data={categoryChartData} budgets={budgets} onEditBudgetClick={() => setIsBudgetModalOpen(true)} />
            </div>

            {/* Daily Trend Bar Chart */}
            <div>
              <DailyTrendChart expenses={expenses} />
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
              startDate={startDate || dashStartDate}
              endDate={endDate || dashEndDate}
              setDateRange={handleDateRangeChange}
              categories={CATEGORIES}
              itemsPerPage={5}
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
            isSticky={true}
            title=""
          />
        )}

        {/* Global Footer */}
        <footer className="footer-text">
          &copy; 2026 Mini Expense Tracker. All rights reserved. Developed by Ritik with ❤️
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

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDeleteExpense}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default App;
