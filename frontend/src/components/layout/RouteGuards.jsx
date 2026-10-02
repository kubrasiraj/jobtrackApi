import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

function FullPageSpinner() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-screen items-center justify-center text-brand-600">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <FullPageSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}
