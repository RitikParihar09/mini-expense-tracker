import React from 'react';
import { Wallet, Tag, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const SummaryCards = ({ stats }) => {
  const {
    totalSpent = 0,
    spentChange = 0,
    totalCount = 0,
    countChange = 0,
    highestSpent = 0,
    highestDate = '',
    dailyAvg = 0
  } = stats;

  const isSpentIncrease = spentChange >= 0;
  const isCountIncrease = countChange >= 0;

  return (
    <div className="summary-cards-grid">
      {/* Total Spent Card */}
      <div className="summary-card">
        <div className="summary-card-details">
          <span className="summary-card-title">Total Spent (This Month)</span>
          <span className="summary-card-value">{formatCurrency(totalSpent)}</span>
          {spentChange > 0 && (
            <span className="summary-card-trend trend-up">
              <span>↗ {Math.abs(spentChange).toFixed(1)}%</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
          {spentChange < 0 && (
            <span className="summary-card-trend trend-down">
              <span>↘ {Math.abs(spentChange).toFixed(1)}%</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
          {spentChange === 0 && (
            <span className="summary-card-trend trend-neutral">
              <span>0.0%</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
        </div>
        <div className="summary-card-icon-wrapper kpi-wallet">
          <Wallet className="summary-card-icon" />
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="summary-card">
        <div className="summary-card-details">
          <span className="summary-card-title">Total Expenses</span>
          <span className="summary-card-value">{totalCount}</span>
          {countChange > 0 && (
            <span className="summary-card-trend trend-up">
              <span>↗ {Math.abs(countChange)}</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
          {countChange < 0 && (
            <span className="summary-card-trend trend-down">
              <span>↘ {Math.abs(countChange)}</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
          {countChange === 0 && (
            <span className="summary-card-trend trend-neutral">
              <span>0</span>
              <span className="trend-neutral" style={{ fontWeight: 400, marginLeft: 2 }}>from last month</span>
            </span>
          )}
        </div>
        <div className="summary-card-icon-wrapper kpi-tag">
          <Tag className="summary-card-icon" />
        </div>
      </div>

      {/* Highest Expense Card */}
      <div className="summary-card">
        <div className="summary-card-details">
          <span className="summary-card-title">Highest Expense</span>
          <span className="summary-card-value">
            {highestSpent > 0 ? formatCurrency(highestSpent) : '₹0.00'}
          </span>
          <span className="trend-neutral" style={{ fontSize: '13px', fontWeight: 500 }}>
            {highestDate ? `on ${formatDate(highestDate)}` : 'No expenses'}
          </span>
        </div>
        <div className="summary-card-icon-wrapper kpi-chart">
          <TrendingUp className="summary-card-icon" />
        </div>
      </div>

      {/* Daily Average Card */}
      <div className="summary-card">
        <div className="summary-card-details">
          <span className="summary-card-title">Daily Average</span>
          <span className="summary-card-value">{formatCurrency(dailyAvg)}</span>
          <span className="trend-neutral" style={{ fontSize: '13px', fontWeight: 500 }}>
            Avg. per day
          </span>
        </div>
        <div className="summary-card-icon-wrapper kpi-clock">
          <Clock className="summary-card-icon" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
