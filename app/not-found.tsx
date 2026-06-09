import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-slate-900 dark:text-white mb-2">
            404
          </h1>
          <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Page not found
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex px-6 py-3 rounded-md font-medium transition-all duration-300 ease-in-out transform hover:scale-105 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
