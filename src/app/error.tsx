'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 dark:text-red-400 text-3xl">⚠️</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Error ID: {error.digest || 'unknown'}
          </div>
        </div>
      </div>
    </div>
  );
} 