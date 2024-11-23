// components/ui/Toast/Toast.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" />;
      case 'error':
        return <XCircle className="toast-icon" />;
      case 'warning':
        return <AlertCircle className="toast-icon" />;
      default:
        return <CheckCircle className="toast-icon" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className={`toast-content ${type}`}>
        <span className="toast-icon-wrapper">
          {getIcon()}
        </span>
        <p className="toast-message">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="toast-close-btn"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default Toast;