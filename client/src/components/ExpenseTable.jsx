import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Pencil, Trash2, Plus, ArrowUpDown, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const ExpenseTable = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
  onAddExpenseClick,
  onExportCsvClick,
  selectedCategory,
  setSelectedCategory,
  startDate,
  endDate,
  setDateRange,
  categories
}) => {
  // Sort State
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Custom Date Popover State
  const [showDatePopover, setShowDatePopover] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate || '');
  const [tempEndDate, setTempEndDate] = useState(endDate || '');
  const popoverRef = useRef(null);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowDatePopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync temp dates when props change
  useEffect(() => {
    setTempStartDate(startDate || '');
    setTempEndDate(endDate || '');
  }, [startDate, endDate]);

  // Handle Sort
  const handleSortDate = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  // Date Range Presets
  const applyPreset = (preset) => {
    const today = new Date();
    let start = '';
    let end = '';

    if (preset === 'this-month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    } else if (preset === 'last-month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    } else if (preset === 'all') {
      start = '';
      end = '';
    }

    setDateRange(start, end);
    setShowDatePopover(false);
    setCurrentPage(1);
  };

  const handleApplyCustomDate = (e) => {
    e.preventDefault();
    setDateRange(tempStartDate, tempEndDate);
    setShowDatePopover(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setDateRange('', '');
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  let processedExpenses = [...expenses];

  // 1. Category Filter
  if (selectedCategory !== 'All') {
    processedExpenses = processedExpenses.filter(e => e.category === selectedCategory);
  }

  // 2. Date Range Filter
  if (startDate) {
    processedExpenses = processedExpenses.filter(e => e.date >= startDate);
  }
  if (endDate) {
    processedExpenses = processedExpenses.filter(e => e.date <= endDate);
  }

  // 3. Sorting (Date)
  processedExpenses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination Calculations
  const totalItems = processedExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndexPage = Math.min(startIndex + itemsPerPage, totalItems);
  const currentExpenses = processedExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If currentPage is near the start
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } 
      // If currentPage is near the end
      else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } 
      // If currentPage is in the middle
      else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Reset page if filtered results drop below index
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, totalPages, currentPage]);

  // Label text for date range filter button
  const getDateRangeLabel = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (startDate) {
      return `After ${formatDate(startDate)}`;
    }
    if (endDate) {
      return `Before ${formatDate(endDate)}`;
    }
    return 'All Dates';
  };

  // Check if filters are active
  const isFiltered = selectedCategory !== 'All' || startDate || endDate;

  return (
    <div className="recent-expenses-card">
      <div className="table-filters-row">
        <h3 className="card-title">Recent Expenses</h3>

        <div className="filters-left-group">
          {/* Category Dropdown */}
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Date Range Picker Selector */}
          <div style={{ position: 'relative' }} ref={popoverRef}>
            <button
              className="date-range-picker-input"
              onClick={() => setShowDatePopover(!showDatePopover)}
            >
              <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
              <span>{getDateRangeLabel()}</span>
            </button>

            {showDatePopover && (
              <div className="custom-date-popover">
                <button className="date-preset-btn" onClick={() => applyPreset('this-month')}>
                  This Month
                </button>
                <button className="date-preset-btn" onClick={() => applyPreset('last-month')}>
                  Last Month
                </button>
                <button className="date-preset-btn" onClick={() => applyPreset('all')}>
                  All Time
                </button>
                
                <form onSubmit={handleApplyCustomDate} className="custom-date-inputs">
                  <label>Custom Date Range</label>
                  <div className="custom-date-row">
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      placeholder="Start date"
                    />
                  </div>
                  <div className="custom-date-row">
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      placeholder="End date"
                    />
                  </div>
                  <div className="custom-date-popover-actions">
                    <button
                      type="button"
                      className="date-popover-btn modal-btn-cancel"
                      onClick={() => setShowDatePopover(false)}
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

          {/* Clear Filters Button */}
          {isFiltered && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {totalItems > 0 && (
            <button
              className="date-range-picker-input"
              onClick={onExportCsvClick}
              title="Export filtered expenses to CSV"
            >
              <Download size={16} style={{ color: 'var(--text-secondary)' }} />
              <span>Export CSV</span>
            </button>
          )}

          <button className="add-expense-btn" onClick={onAddExpenseClick}>
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {totalItems === 0 ? (
          <div className="empty-state">
            <X className="empty-state-icon" />
            <h4 className="empty-state-title">No expenses found</h4>
            <p className="empty-state-desc">
              Try adjusting your filters or add a new expense to get started.
            </p>
          </div>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th className="sortable" onClick={handleSortDate} style={{ width: '15%' }}>
                  Date 
                  <span className="sort-icon-group">
                    <ArrowUpDown size={10} style={{ marginLeft: 4 }} />
                  </span>
                </th>
                <th style={{ width: '25%' }}>Description</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '15%' }}>Amount</th>
                <th style={{ width: '20%' }}>Note</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{formatDate(exp.date)}</td>
                  <td>{exp.description}</td>
                  <td>
                    <span className={`category-badge badge-${exp.category.toLowerCase()}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="table-amount">{formatCurrency(exp.amount)}</td>
                  <td className="table-note" title={exp.note}>{exp.note || '—'}</td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEditExpense(exp)}
                        title="Edit expense"
                      >
                        <Pencil className="action-btn-icon" />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDeleteExpense(exp.id)}
                        title="Delete expense"
                      >
                        <Trash2 className="action-btn-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalItems > 0 && (
        <div className="table-footer">
          <span>
            Showing {startIndex + 1} to {endIndexPage} of {totalItems} expenses
          </span>

          <div className="pagination-group">
            <button
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page, idx) => {
               if (page === '...') {
                 return (
                   <span key={`ellipsis-${idx}`} className="pagination-ellipsis" style={{ padding: '0 8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', alignSelf: 'center', fontSize: '14px', fontWeight: 600 }}>
                     ...
                   </span>
                 );
               }
               return (
                 <button
                   key={page}
                   className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                   onClick={() => handlePageChange(page)}
                 >
                   {page}
                 </button>
               );
             })}

            <button
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
