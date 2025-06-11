import React from 'react';

interface ErrorMessageProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oups !</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
