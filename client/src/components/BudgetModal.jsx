import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, budgets, onSave, categories }) => {
  const [formBudgets, setFormBudgets] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (budgets) {
      const initial = {};
      categories.forEach(cat => {
        initial[cat] = budgets[cat] !== undefined ? budgets[cat].toString() : '';
      });
      setFormBudgets(initial);
      setErrors({});
    }
  }, [budgets, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (cat, val) => {
    setFormBudgets(prev => ({
      ...prev,
      [cat]: val
    }));
    if (errors[cat]) {
      setErrors(prev => ({
        ...prev,
        [cat]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    categories.forEach(cat => {
      const val = parseFloat(formBudgets[cat]);
      if (formBudgets[cat] === '') {
        newErrors[cat] = 'Budget is required';
      } else if (isNaN(val) || val < 0) {
        newErrors[cat] = 'Must be a non-negative number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedBudgets = {};
    categories.forEach(cat => {
      parsedBudgets[cat] = parseFloat(formBudgets[cat]);
    });

    onSave(parsedBudgets);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Set Monthly Budgets</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map(cat => (
              <div key={cat} className="form-group" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor={`budget-${cat}`} style={{ fontSize: '14px', fontWeight: 600 }}>{cat}</label>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>₹</span>
                  <input
                    type="number"
                    id={`budget-${cat}`}
                    className="form-input"
                    value={formBudgets[cat] || ''}
                    onChange={(e) => handleChange(cat, e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="any"
                    style={{ paddingLeft: '24px', width: '100%' }}
                  />
                </div>
                {errors[cat] && (
                  <span className="form-error-msg">{errors[cat]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-submit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
