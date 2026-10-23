import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Archive from './pages/Archive';
import Trash from './pages/Trash';

/**
 * Core Application Routes Orchestrator
 * Integrates AuthProvider and binds Public/Protected layout security wrappers.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page (Accessible to all) */}
            <Route path={ROUTES.HOME} element={<Home />} />

            {/* Unauthenticated Access Gate (Redirects to dashboard if logged in) */}
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
            </Route>

            {/* Authenticated Access Gate (Redirects to login if session is empty) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.FAVORITES} element={<Favorites />} />
                <Route path={ROUTES.ARCHIVE} element={<Archive />} />
                <Route path={ROUTES.TRASH} element={<Trash />} />
              </Route>
            </Route>

            {/* Fallback Catch-all: Route back to landing Home */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
