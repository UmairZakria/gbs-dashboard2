import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
      </div>
      <div className="text-red-600 text-lg font-medium mb-2">Error</div>
      <div className="text-gray-600 mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 