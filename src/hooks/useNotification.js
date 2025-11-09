/**
 * Custom hook for managing notifications
 */
import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({ message: null, type: 'success' });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ message: null, type: 'success' });
  }, []);

  const showSuccess = useCallback((message) => {
    showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message) => {
    showNotification(message, 'error');
  }, [showNotification]);

  const showInfo = useCallback((message) => {
    showNotification(message, 'info');
  }, [showNotification]);

  const showWarning = useCallback((message) => {
    showNotification(message, 'warning');
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

