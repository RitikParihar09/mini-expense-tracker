import React from 'react';
import { formatCurrency } from '../utils/helpers';

const CATEGORY_COLORS = {
  Food: '#3b82f6',
  Transport: '#10b981',
  Bills: '#f59e0b',
  Entertainment: '#8b5cf6',
  Other: '#ec4899'
};

const CategoryChart = ({ data, timePeriod, setTimePeriod }) => {
  // Calculate total across all categories
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // Map data to include percentage
  const chartData = data.map((item) => ({
    ...item,
    percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    color: CATEGORY_COLORS[item.category] || '#64748b'
  }));

  // SVG Calculations
  const radius = 55;
  const strokeWidth = 18;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius; // 345.57

  let accumulatedPercentage = 0;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">Expenses by Category</h3>
        <select
          className="card-header-select"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="all-time">All Time</option>
        </select>
      </div>

      <div className="chart-content-wrapper">
        {totalAmount === 0 ? (
          <div className="donut-chart-container" style={{ width: '160px', height: '160px' }}>
            <svg width="160" height="160" className="donut-chart-svg">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
            </svg>
            <div className="donut-chart-center-text">
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>No Data</span>
            </div>
          </div>
        ) : (
          <div className="donut-chart-container" style={{ width: '160px', height: '160px' }}>
            <svg width="160" height="160" className="donut-chart-svg">
              {chartData.map((item, index) => {
                if (item.percentage === 0) return null;

                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                
                accumulatedPercentage += item.percentage;

                return (
                  <circle
                    key={item.category}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                  />
                );
              })}
            </svg>
          </div>
        )}

        <div className="chart-legend-list">
          {chartData.map((item) => (
            <div key={item.category} className="chart-legend-item">
              <div className="legend-label-group">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-category-name">{item.category}</span>
              </div>
              <div className="legend-values">
                <span>{formatCurrency(item.amount)}</span>
                <span className="legend-percentage">({item.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
