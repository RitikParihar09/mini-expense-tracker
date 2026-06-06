const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Helper to handle fetch responses and handle JSON errors.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch all expenses from backend, filtered by category and date range.
 */
export const fetchExpenses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') {
    params.append('category', filters.category);
  }
  if (filters.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    params.append('endDate', filters.endDate);
  }

  const url = `${API_BASE_URL}/expenses?${params.toString()}`;
  return fetch(url).then(handleResponse);
};

/**
 * Fetch dashboard metrics for the given date range.
 */
export const fetchStats = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/expenses/stats?${params.toString()}`;
  return fetch(url).then(handleResponse);
};

/**
 * Add a new expense transaction.
 */
export const createExpense = async (expenseData) => {
  const url = `${API_BASE_URL}/expenses`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  }).then(handleResponse);
};

/**
 * Update an existing expense transaction.
 */
export const updateExpense = async (id, expenseData) => {
  const url = `${API_BASE_URL}/expenses/${id}`;
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  }).then(handleResponse);
};

/**
 * Delete an expense transaction.
 */
export const deleteExpense = async (id) => {
  const url = `${API_BASE_URL}/expenses/${id}`;
  return fetch(url, {
    method: 'DELETE'
  }).then(handleResponse);
};

/**
 * Get category monthly budgets.
 */
export const fetchBudgets = async () => {
  const url = `${API_BASE_URL}/budgets`;
  return fetch(url).then(handleResponse);
};

/**
 * Save monthly category budgets configuration.
 */
export const updateBudgets = async (budgetsData) => {
  const url = `${API_BASE_URL}/budgets`;
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgetsData)
  }).then(handleResponse);
};
