import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

/**
 * Route Gate: Public Entry Screens (Login, Register)
 * Prevents logged-in sessions from viewing authentication forms by redirecting them to the dashboard.
 */
export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div className="skeleton-item skeleton-pulse" style={{ height: '350px' }} />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
}
