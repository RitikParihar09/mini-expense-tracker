import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Wallet,
  Sun,
  Moon,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onAddExpenseClick, theme, setTheme, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', name: 'Expenses', icon: Receipt },
    { id: 'add-expense', name: 'Add Expense', icon: PlusCircle, onClick: onAddExpenseClick }
  ];

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else {
      setActiveTab(item.id);
    }
    setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">
            <Wallet size={18} />
          </div>
          <span>Expense Tracker</span>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} title="Close Menu">
            <X size={18} />
          </button>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <a
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  <IconComponent className="sidebar-item-icon" />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="theme-toggle-container">
        <button
          className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          title="Switch to Light Theme"
        >
          <Sun size={15} />
          <span>Light</span>
        </button>
        <button
          className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          title="Switch to Dark Theme"
        >
          <Moon size={15} />
          <span>Dark</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
