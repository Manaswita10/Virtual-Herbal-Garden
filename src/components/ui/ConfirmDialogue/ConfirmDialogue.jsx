// components/ui/ConfirmDialog/ConfirmDialog.jsx
'use client';

import React from 'react';
import '/src/components/ui/ConfirmDialogue/ConfirmDialogue.css';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-buttons">
          <button 
            className="confirm-dialog-button confirm"
            onClick={onConfirm}
          >
            OK
          </button>
          <button 
            className="confirm-dialog-button cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;