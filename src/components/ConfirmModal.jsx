/**
 * Confirm Modal Component
 * A custom confirmation dialog to replace browser confirm() alerts
 */
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const bgColor = type === 'danger' 
    ? 'bg-red-600 hover:bg-red-700'
    : type === 'warning'
    ? 'bg-yellow-600 hover:bg-yellow-700'
    : 'bg-umass-maroon hover:bg-umass-maroonDark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 border-2 border-gray-200 pointer-events-auto"
      >
        {/* Title */}
        {title && (
          <h3 className="text-xl font-bold text-umass-maroon mb-4">{title}</h3>
        )}
        
        {/* Message */}
        <p className="text-gray-700 mb-6 whitespace-pre-line">{message}</p>
        
        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 ${bgColor} text-white rounded-lg font-semibold transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

