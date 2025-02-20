import React from 'react';

export const SuccessAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 shadow-lg max-w-md">
    <div className="flex justify-between items-start">
      <div className="flex-1">{message}</div>
      <button 
        onClick={onClose}
        className="ml-4 text-green-600 hover:text-green-800"
      >
        ×
      </button>
    </div>
  </div>
);