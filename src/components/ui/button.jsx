import React from 'react';
import '/src/components/ui/button.css';

export function Button({ className = '', variant = 'default', size = 'default', children, ...props }) {
  const buttonClass = `button button-${variant} button-${size} ${className}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}