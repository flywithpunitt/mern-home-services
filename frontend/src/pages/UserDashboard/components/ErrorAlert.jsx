// ErrorAlert.jsx
import React from 'react';

export const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-lg border border-red-200">
    {message}
  </div>
);