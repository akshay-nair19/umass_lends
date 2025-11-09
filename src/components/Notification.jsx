/**
 * Notification Component
 * Displays success and error messages on the page
 */
import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-100 border-green-400 text-green-700'
    : type === 'error'
    ? 'bg-red-100 border-red-400 text-red-700'
    : type === 'info'
    ? 'bg-blue-100 border-blue-400 text-blue-700'
    : 'bg-yellow-100 border-yellow-400 text-yellow-700';

  const icon = type === 'success' 
    ? '✓'
    : type === 'error'
    ? '✕'
    : type === 'info'
    ? 'ℹ'
    : '⚠';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} border px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slide-in`}>
      <span className="text-xl font-bold">{icon}</span>
      <p className="flex-1 font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 font-bold text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;

