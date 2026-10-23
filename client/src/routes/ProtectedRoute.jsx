import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

/**
 * Route Gate: Protected Workspaces
 * Inspects session context state, blocks unauthenticated users, and loads layout panels.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="w-50">
            <div className="skeleton-item skeleton-pulse" style={{ height: '32px', marginBottom: '8px' }} />
            <div className="skeleton-item skeleton-pulse" style={{ height: '16px', width: '60%' }} />
          </div>
        </div>
        <LoadingSkeleton variant="card" rows={3} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
