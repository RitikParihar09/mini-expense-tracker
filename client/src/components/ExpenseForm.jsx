import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense, categories }) => {
  const [formData, setFormData] = useState({
    date: getTodayString(),
    description: '',
    category: '',
    amount: '',
    note: ''
  });

  const [errors, setErrors] = useState({});

  // Sync state if editing an existing expense
  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        description: expense.description,
        category: expense.category,
        amount: expense.amount.toString(),
        note: expense.note || ''
      });
      setErrors({});
    } else {
      setFormData({
        date: getTodayString(),
        description: '',
        category: '',
        amount: '',
        note: ''
      });
      setErrors({});
    }
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const todayStr = getTodayString();

    // 1. Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // 2. Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // 3. Amount validation
    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // 4. Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date > todayStr) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submissionData = {
      description: formData.description.trim(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
      note: formData.note.trim()
    };

    if (expense) {
      // Pass ID if editing
      onSubmit({ ...submissionData, id: expense.id });
    } else {
      onSubmit(submissionData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{expense ? 'Edit Expense' : 'Add Expense'}</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Lunch with friends"
              className={`form-input ${errors.description ? 'has-error' : ''}`}
            />
            {errors.description && (
              <span className="form-error-msg">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="any"
                className={`form-input ${errors.amount ? 'has-error' : ''}`}
              />
              {errors.amount && (
                <span className="form-error-msg">{errors.amount}</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input ${errors.category ? 'has-error' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="form-error-msg">{errors.category}</span>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={getTodayString()}
              className={`form-input ${errors.date ? 'has-error' : ''}`}
            />
            {errors.date && <span className="form-error-msg">{errors.date}</span>}
          </div>

          {/* Optional Note */}
          <div className="form-group">
            <label htmlFor="note">Note (Optional)</label>
            <input
              type="text"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add details (e.g. Pizza and drinks)"
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-submit">
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
