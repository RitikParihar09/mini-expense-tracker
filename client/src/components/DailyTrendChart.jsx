import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { TrendingUp } from 'lucide-react';

const DailyTrendChart = ({ expenses }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Calculate the last 7 calendar days ending today
  const getLast7Days = () => {
    const list = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      list.push({ dateStr, dayName, label });
    }
    return list;
  };

  const last7Days = getLast7Days();

  // 2. Aggregate expenses for each of those 7 days
  const dailyData = last7Days.map((day) => {
    const total = expenses
      .filter((e) => e.date === day.dateStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return {
      ...day,
      amount: total
    };
  });

  const maxAmount = Math.max(...dailyData.map((d) => d.amount), 0);
  const totalPeriodAmount = dailyData.reduce((sum, d) => sum + d.amount, 0);
  const dailyAverage = totalPeriodAmount / 7;

  // SVG dimensions
  const width = 600;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Clean proportional bar width and spacing
  const barWidth = 32; 
  const gap = (chartWidth - barWidth * 7) / 6;

  // Grid lines data (Y positions)
  const gridLinesCount = 3;
  const gridLines = Array.from({ length: gridLinesCount }, (_, i) => {
    const ratio = i / (gridLinesCount - 1);
    const y = paddingTop + chartHeight * (1 - ratio);
    const val = maxAmount * ratio;
    return { y, val };
  });

  return (
    <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
      <div className="card-header" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: 'var(--text-active)' }} />
          <h3 className="card-title" style={{ margin: 0 }}>Daily Spending (Last 7 Days)</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          {hoveredIndex !== null ? (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                {dailyData[hoveredIndex].label} ({dailyData[hoveredIndex].dayName})
              </span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-active)' }}>
                {formatCurrency(dailyData[hoveredIndex].amount)}
              </span>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                7-Day Daily Avg
              </span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(dailyAverage)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width="100%" 
          height="100%" 
          style={{ display: 'block', minWidth: '450px' }}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={width - paddingRight}
                y2={line.y}
                stroke="var(--border-color)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={line.y + 4}
                textAnchor="end"
                style={{ fontSize: '10px', fill: 'var(--text-muted)', fontFamily: 'inherit', fontWeight: 500 }}
              >
                {maxAmount > 0 ? (line.val >= 1000 ? `₹${(line.val / 1000).toFixed(1)}k` : `₹${line.val.toFixed(0)}`) : '₹0'}
              </text>
            </g>
          ))}

          {/* Bars */}
          {dailyData.map((day, idx) => {
            const barHeight = maxAmount > 0 ? (day.amount / maxAmount) * chartHeight : 0;
            const x = paddingLeft + idx * (barWidth + gap);
            const y = paddingTop + chartHeight - barHeight;
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx}>
                {/* Background active area for easier hovering */}
                <rect
                  x={x - gap / 2}
                  y={paddingTop}
                  width={barWidth + gap}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                />

                {/* Actual Spending Bar */}
                {barHeight > 0 ? (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    ry="4"
                    fill="url(#barGradient)"
                    opacity={isHovered ? 1.0 : 0.85}
                    style={{
                      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s',
                      pointerEvents: 'none',
                      transformOrigin: `${x + barWidth / 2}px ${paddingTop + chartHeight}px`,
                      transform: isHovered ? 'scale(1.15, 1.05)' : 'scale(1)',
                    }}
                  />
                ) : (
                  // Zero state subtle horizontal line
                  <rect
                    x={x}
                    y={paddingTop + chartHeight - 3}
                    width={barWidth}
                    height={3}
                    rx="1.5"
                    ry="1.5"
                    fill="var(--border-color)"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 16}
                  textAnchor="middle"
                  style={{
                    fontSize: '10px',
                    fill: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'inherit',
                    fontWeight: isHovered ? 600 : 500,
                    transition: 'fill 0.2s'
                  }}
                >
                  {day.dayName}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={height - 4}
                  textAnchor="middle"
                  style={{
                    fontSize: '9px',
                    fill: 'var(--text-muted)',
                    fontFamily: 'inherit',
                    fontWeight: 500
                  }}
                >
                  {day.label.split(' ')[1]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default DailyTrendChart;
