import { Link } from 'react-router-dom';
import { ToothIcon } from '../components/common/Icons';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 text-center">
      <ToothIcon className="h-16 w-16 text-primary-500" />
      <h1 className="mt-6 text-4xl font-bold text-neutral-900">404 - Page Not Found</h1>
      <p className="mt-3 max-w-md text-lg text-neutral-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;