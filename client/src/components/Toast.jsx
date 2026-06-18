import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} style={{ color: '#10b981' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      default:
        return <Info size={16} style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div className={`custom-toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
