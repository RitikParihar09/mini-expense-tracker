import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

const CATEGORY_COLORS = {
  Food: '#3b82f6',
  Transport: '#10b981',
  Bills: '#f59e0b',
  Entertainment: '#8b5cf6',
  Other: '#ec4899'
};

const CategoryChart = ({ data }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Calculate total across all categories
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // Map data to include percentage
  const chartData = data.map((item) => ({
    ...item,
    percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    color: CATEGORY_COLORS[item.category] || '#64748b'
  }));

  // SVG Calculations (Increased size to 240x240)
  const radius = 85;
  const strokeWidth = 24;
  const cx = 120;
  const cy = 120;
  const circumference = 2 * Math.PI * radius; // 534.07

  let accumulatedPercentage = 0;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">Expenses by Category</h3>
      </div>

      <div className="chart-content-wrapper">
        {totalAmount === 0 ? (
          <div className="donut-chart-container" style={{ width: '240px', height: '240px', position: 'relative' }}>
            <svg width="240" height="240" className="donut-chart-svg">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
            </svg>
            <div className="donut-chart-center-text">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>No Data</span>
            </div>
          </div>
        ) : (
          <div className="donut-chart-container" style={{ width: '240px', height: '240px', position: 'relative' }}>
            <svg width="240" height="240" className="donut-chart-svg">
              {chartData.map((item) => {
                if (item.percentage === 0) return null;

                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                
                accumulatedPercentage += item.percentage;
                const isHovered = hoveredCategory && hoveredCategory.category === item.category;

                return (
                  <circle
                    key={item.category}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    onMouseEnter={() => setHoveredCategory(item)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    style={{
                      transition: 'stroke-width 0.2s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 0.5s ease-in-out',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </svg>
            <div className="donut-chart-center-text" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: 'none',
              width: '140px'
            }}>
              {hoveredCategory ? (
                <>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {hoveredCategory.category}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {formatCurrency(hoveredCategory.amount)}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: hoveredCategory.color, marginTop: '2px' }}>
                    {hoveredCategory.percentage.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {formatCurrency(totalAmount)}
                  </span>
                </>
              )}
            </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
