import React from 'react';
import '/src/components/ui/alert.css';

export function Alert({ children, variant = 'default', className = '', ...props }) {
  const alertClass = `alert alert-${variant} ${className}`;
  
  return (
    <div role="alert" className={alertClass} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ className = '', children, ...props }) {
  return (
    <h5 className={`alert-title ${className}`} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className = '', children, ...props }) {
  return (
    <div className={`alert-description ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog-backdrop" onClick={onClose} />
      <div className="alert-dialog-content">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogContent({ children }) {
  return <div className="alert-dialog-container">{children}</div>;
}

export function AlertDialogHeader({ children }) {
  return <div className="alert-dialog-header">{children}</div>;
}

export function AlertDialogFooter({ children }) {
  return <div className="alert-dialog-footer">{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="alert-dialog-title">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="alert-dialog-description">{children}</p>;
}

export function AlertDialogAction({ children, onClick }) {
  return (
    <button className="alert-dialog-action" onClick={onClick}>
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, onClick }) {
  return (
    <button className="alert-dialog-cancel" onClick={onClick}>
      {children}
    </button>
  );
}