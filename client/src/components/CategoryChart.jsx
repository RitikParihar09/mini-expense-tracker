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

  const handleMouseEnter = (item) => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHoveredCategory(item);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setHoveredCategory(null);
    }
  };

  const handleSliceClick = (item) => {
    setHoveredCategory((prev) => (prev && prev.category === item.category ? null : item));
  };

  // SVG Calculations: Thicker stroke width (32px) and adjusted radius (75px) for a chunkier, premium look
  const radius = 75; 
  const strokeWidth = 32;
  const cx = 105;
  const cy = 105;
  const circumference = 2 * Math.PI * radius; // ~471.24

  let accumulatedPercentage = 0;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3 className="card-title">Expenses by Category</h3>
      </div>

      <div className="chart-content-wrapper">
        {totalAmount === 0 ? (
          <div className="donut-chart-container" style={{ width: '210px', height: '210px', position: 'relative' }}>
            <svg width="210" height="210" className="donut-chart-svg">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth={strokeWidth}
              />
            </svg>
            <div className="donut-chart-center-text">
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>No Data</span>
            </div>
          </div>
        ) : (
          <div className="donut-chart-container" style={{ width: '210px', height: '210px', position: 'relative' }}>
            <svg width="210" height="210" className="donut-chart-svg" style={{ overflow: 'visible' }}>
              <defs>
                {/* Glow drop-shadow for hovered segments */}
                <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.2  0 0 0 0.15 0" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Circular Track */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth={strokeWidth}
                opacity="0.35"
              />

              {/* Segment Slices */}
              {chartData.map((item) => {
                if (item.percentage === 0) return null;

                // Subtract a tiny fraction (0.8%) from each segment's stroke to create a clean gap between slices
                const gapPercent = 0.8;
                const activePercentage = Math.max(0.2, item.percentage - gapPercent);
                
                // We offset starting point to center the gap
                const strokeDasharray = `${(activePercentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -(((accumulatedPercentage + (gapPercent / 2)) / 100) * circumference);
                
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
                    strokeWidth={isHovered ? strokeWidth + 8 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    filter={isHovered ? 'url(#donutGlow)' : 'none'}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleSliceClick(item)}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'stroke-width 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s',
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
              width: '110px'
            }}>
              {hoveredCategory ? (
                <>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {hoveredCategory.category}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    ₹{(hoveredCategory.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: hoveredCategory.color, marginTop: '2px' }}>
                    {hoveredCategory.percentage.toFixed(0)}%
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Spent
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-all' }}>
                    ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Connected Legend */}
        <div className="chart-legend-list">
          {chartData.map((item) => {
            const isHovered = hoveredCategory && hoveredCategory.category === item.category;
            return (
              <div 
                key={item.category} 
                className="chart-legend-item"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleSliceClick(item)}
                style={{
                  cursor: 'pointer',
                  opacity: hoveredCategory ? (isHovered ? 1.0 : 0.4) : 1.0,
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'opacity 0.2s, transform 0.2s'
                }}
              >
                <div className="legend-label-group">
                  <span
                    className="legend-dot"
                    style={{ 
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                      boxShadow: isHovered ? `0 0 8px ${item.color}` : 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  />
                  <span 
                    className="legend-category-name" 
                    style={{ 
                      fontWeight: isHovered ? 600 : 500,
                      color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
