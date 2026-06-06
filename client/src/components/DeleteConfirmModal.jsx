import React from 'react';
import { X, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '280px' }}>
        <div className="modal-header" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '14px' }}>Confirm Delete</h3>
          <button className="close-modal-btn" onClick={onClose} style={{ padding: '2px' }}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: '#fee2e2', 
            color: '#ef4444', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 8px auto'
          }}>
            <Trash2 size={16} />
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
          </p>
        </div>

        <div className="modal-actions" style={{ padding: '8px 12px' }}>
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="modal-btn modal-btn-submit" 
            onClick={onConfirm}
            style={{ backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '12px' }}
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
