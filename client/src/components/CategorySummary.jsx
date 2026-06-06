import React from 'react';
import { Utensils, Car, FileText, Gamepad2, MoreHorizontal, Edit3, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const CATEGORY_META = {
  Food: {
    icon: Utensils,
    bgColor: '#e0f2fe',
    iconColor: '#3b82f6',
    barColor: '#3b82f6'
  },
  Transport: {
    icon: Car,
    bgColor: '#d1fae5',
    iconColor: '#10b981',
    barColor: '#10b981'
  },
  Bills: {
    icon: FileText,
    bgColor: '#fef3c7',
    iconColor: '#f59e0b',
    barColor: '#f59e0b'
  },
  Entertainment: {
    icon: Gamepad2,
    bgColor: '#ede9fe',
    iconColor: '#8b5cf6',
    barColor: '#8b5cf6'
  },
  Other: {
    icon: MoreHorizontal,
    bgColor: '#fce7f3',
    iconColor: '#ec4899',
    barColor: '#ec4899'
  }
};

const CategorySummary = ({ data, budgets = {}, onEditBudgetClick }) => {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">Category Summary</h3>
        <button
          className="edit-budget-btn-header"
          onClick={onEditBudgetClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            padding: '6px 12px',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(79, 70, 229, 0.08)',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Edit monthly category budgets"
        >
          <Edit3 size={13} />
          <span>Edit Budget</span>
        </button>
      </div>

      <div className="category-summary-list">
        {data.map((item) => {
          const meta = CATEGORY_META[item.category] || {
            icon: MoreHorizontal,
            bgColor: '#f1f5f9',
            iconColor: '#64748b',
            barColor: '#64748b'
          };
          const IconComponent = meta.icon;
          
          const limit = budgets[item.category] || 0;
          const isOverBudget = limit > 0 && item.amount > limit;
          const budgetPercent = limit > 0 ? (item.amount / limit) * 100 : 0;
          
          const displayPercentage = limit > 0 ? budgetPercent : (totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0);
          const barWidth = limit > 0 ? Math.min(100, budgetPercent) : (totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0);

          return (
            <div key={item.category} className="category-summary-item">
              <div
                className="category-icon-circle"
                style={{ backgroundColor: meta.bgColor, color: meta.iconColor }}
              >
                <IconComponent size={18} />
              </div>

              <div className="category-summary-details">
                <div className="category-summary-info">
                  <span className="category-summary-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {item.category}
                    {isOverBudget && (
                      <span className="tiny-warning-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <AlertTriangle size={10} />
                        <span>Over by ₹{(item.amount - limit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </span>
                    )}
                  </span>
                  <span className="category-summary-amount" style={{ display: 'flex', alignItems: 'baseline' }}>
                    {formatCurrency(item.amount)}
                    {limit > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>
                        / {formatCurrency(limit)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isOverBudget ? '#ef4444' : meta.barColor
                    }}
                  />
                </div>
              </div>

              <div className="category-summary-percentage-label" style={{ color: isOverBudget ? '#ef4444' : 'var(--text-secondary)', fontWeight: isOverBudget ? 600 : 500 }}>
                {displayPercentage.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySummary;
