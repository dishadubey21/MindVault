import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

/**
 * Shared Application Frame Layout (Navbar + Sidebar + Core outlet panel)
 * Dynamically binds authenticated user profiles and handles logouts.
 */
export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch {
      // Force navigation anyway
      navigate(ROUTES.LOGIN);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'MV';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Global Navigation Bar */}
      <nav
        className="navbar border-bottom sticky-top px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          zIndex: 100,
        }}
      >
        <div className="container-fluid px-0">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            to={ROUTES.DASHBOARD}
            style={{ color: 'var(--text-primary)' }}
          >
            <div
              className="d-flex align-items-center justify-content-center bg-primary rounded-3 text-white"
              style={{
                width: '34px',
                height: '34px',
                backgroundColor: 'var(--brand-primary)',
              }}
            >
              <i className="bi bi-safe2-fill"></i>
            </div>
            <span className="h5 mb-0 fw-bold" style={{ letterSpacing: '-0.02em' }}>
              MindVault
            </span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Button
              variant="secondary"
              onClick={toggleTheme}
              className="p-2 border-0"
              title="Toggle Light/Dark Theme"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-fill'}`}></i>
            </Button>
            
            {/* Nav Profile details */}
            <div className="d-flex align-items-center gap-2 border-start border-color ps-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--brand-primary)',
                  fontSize: '0.85rem',
                }}
              >
                {getInitials(user?.username)}
              </div>
              <span className="text-secondary small fw-medium d-none d-md-inline">
                {user?.username || 'Workspace'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Page Body (Sidebar + Content outlet) */}
      <div className="d-flex flex-grow-1">
        {/* Persistent Desktop Sidebar */}
        <aside
          className="d-none d-md-flex flex-column p-4 border-end"
          style={{
            width: '260px',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            flexShrink: 0,
          }}
        >
          <div className="d-flex flex-column gap-2 flex-grow-1">
            <NavLink
              to={ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `nav-link p-3 rounded-3 d-flex align-items-center gap-3 fw-medium ${
                  isActive ? 'border border-color' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-all)',
              })}
            >
              <i className="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to={ROUTES.FAVORITES}
              className={({ isActive }) =>
                `nav-link p-3 rounded-3 d-flex align-items-center gap-3 fw-medium ${
                  isActive ? 'border border-color' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-all)',
              })}
            >
              <i className="bi bi-star-fill"></i>
              <span>Favorites</span>
            </NavLink>

            <NavLink
              to={ROUTES.ARCHIVE}
              className={({ isActive }) =>
                `nav-link p-3 rounded-3 d-flex align-items-center gap-3 fw-medium ${
                  isActive ? 'border border-color' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-all)',
              })}
            >
              <i className="bi bi-archive-fill"></i>
              <span>Archive</span>
            </NavLink>

            <NavLink
              to={ROUTES.TRASH}
              className={({ isActive }) =>
                `nav-link p-3 rounded-3 d-flex align-items-center gap-3 fw-medium ${
                  isActive ? 'border border-color' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-all)',
              })}
            >
              <i className="bi bi-trash-fill"></i>
              <span>Trash</span>
            </NavLink>
          </div>

          {/* Sidebar Account & Logout Controls */}
          <div className="pt-4 border-top d-flex flex-column gap-3" style={{ borderColor: 'var(--border-color)' }}>
            <div
              className="d-flex align-items-center justify-content-center p-3 rounded-3 border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="text-center">
                <small className="text-muted d-block mb-1 font-monospace" style={{ fontSize: '0.75rem' }}>
                  TIER STATUS
                </small>
                {user?.isPremium ? (
                  <span className="badge bg-light text-warning border border-warning px-3 py-1.5 rounded-pill fw-semibold">
                    <i className="bi bi-star-fill me-1"></i> Premium
                  </span>
                ) : (
                  <span className="badge bg-light text-primary border border-color px-3 py-1.5 rounded-pill fw-semibold">
                    Free Account
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={handleLogout}
              className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* 3. Core Page Content Display Area */}
        <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
