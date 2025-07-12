import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 dark:text-red-400 text-3xl">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Or try one of these pages:
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leads"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Leads
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 