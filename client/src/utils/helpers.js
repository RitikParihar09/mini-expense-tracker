/**
 * Formats a number to Indian Rupee (INR) currency format.
 * E.g., 12540.50 -> ₹12,540.50
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a date string (YYYY-MM-DD) or Date object to a readable format.
 * E.g., '2025-06-03' -> 'Jun 3, 2025'
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  
  // Parse date string without timezone shifts (avoid UTC conversion offsets)
  let date;
  if (typeof dateInput === 'string') {
    const [year, month, day] = dateInput.split('-').map(Number);
    // Month is 0-indexed in JS Date constructor
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateInput);
  }
  
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Parses a date string and returns a Date object.
 */
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Exports an array of expenses to a CSV file and triggers a browser download.
 */
export const exportToCSV = (expenses) => {
  if (!expenses || expenses.length === 0) {
    alert('No expenses to export.');
    return;
  }

  // Define headers
  const headers = ['Date', 'Description', 'Category', 'Amount (INR)', 'Note'];
  
  // Map rows
  const rows = expenses.map(exp => [
    exp.date,
    `"${exp.description.replace(/"/g, '""')}"`, // escape quotes
    exp.category,
    exp.amount,
    `"${(exp.note || '').replace(/"/g, '""')}"`
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');

  // Create Blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
