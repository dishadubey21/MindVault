import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useTheme } from '../hooks/useTheme';

/**
 * MindVault Premium Home Landing Page
 */
export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container py-5">
      <div className="text-center py-5 mb-5">
        <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
          <div
            className="d-flex align-items-center justify-content-center bg-primary rounded-circle text-white shadow-sm"
            style={{ width: '60px', height: '60px', backgroundColor: 'var(--brand-primary)' }}
          >
            <i className="bi bi-safe2-fill fs-2"></i>
          </div>
          <h1 className="display-4 fw-extrabold mb-0" style={{ letterSpacing: '-0.03em' }}>
            MindVault
          </h1>
        </div>

        <p className="lead text-secondary max-width-md mx-auto mb-5" style={{ maxWidth: '600px' }}>
          A secure, high-performance Personal Knowledge Management system built to index and retain your thoughts, notes, and research.
        </p>

        <div className="d-flex justify-content-center gap-3 align-items-center">
          <Link to={ROUTES.LOGIN}>
            <Button variant="primary">Get Started</Button>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <Button variant="secondary">Create Account</Button>
          </Link>
          <Button variant="secondary" onClick={toggleTheme}>
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-fill'}`}></i>
          </Button>
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-12 col-md-4">
          <Card
            title="Clean Editor"
            subtitle="Rich Markdown"
            className="text-center border-0 shadow-sm"
          >
            <div className="fs-1 text-primary mb-3">
              <i className="bi bi-file-earmark-richtext"></i>
            </div>
            <p className="text-secondary mb-0">
              Compose ideas smoothly with our custom integrated TipTap editor support.
            </p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card
            title="Secure Vault"
            subtitle="Encrypted Sessions"
            className="text-center border-0 shadow-sm"
          >
            <div className="fs-1 text-primary mb-3">
              <i className="bi bi-shield-lock"></i>
            </div>
            <p className="text-secondary mb-0">
              Keep your credentials and thoughts guarded with strict HttpOnly cookies and password encryptions.
            </p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card
            title="SaaS Aesthetic"
            subtitle="Responsive Design"
            className="text-center border-0 shadow-sm"
          >
            <div className="fs-1 text-primary mb-3">
              <i className="bi bi-palette"></i>
            </div>
            <p className="text-secondary mb-0">
              Immerse yourself in a workspace styled with smooth, customizable light and dark theme variable frameworks.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
