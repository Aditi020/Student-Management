import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import '../styles/components/Toast.css';

const ToastNotification = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" />;
      case 'error':
        return <AlertCircle className="toast-icon error" />;
      case 'warning':
        return <AlertCircle className="toast-icon warning" />;
      default:
        return <AlertCircle className="toast-icon info" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        <div className="toast-content">
          {getIcon()}
          <div className="toast-message">{message}</div>
          <button onClick={onClose} className="toast-close">
            <X className="toast-close-icon" />
          </button>
        </div>
        <div className="toast-progress"></div>
      </div>
    </div>
  );
};

export default ToastNotification;