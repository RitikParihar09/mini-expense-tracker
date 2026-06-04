import React from 'react';
import { Utensils, Car, FileText, Gamepad2, MoreHorizontal, Edit3 } from 'lucide-react';
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

const CategorySummary = ({ data, onEditBudgetClick }) => {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">Category Summary</h3>
        <button
          className="clear-filters-btn"
          onClick={onEditBudgetClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '6px 10px',
            border: '1px solid var(--border-dark)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)'
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
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;

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
                  <span className="category-summary-name">{item.category}</span>
                  <span className="category-summary-amount">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: meta.barColor
                    }}
                  />
                </div>
              </div>

              <div className="category-summary-percentage-label">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySummary;
