import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import authService from '../services/authService';

/**
 * Email Verification Trigger Landing Page
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your account details...');

  useEffect(() => {
    const executeVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Account verification token is missing from URL parameters.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email address has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have expired or is invalid.');
      }
    };

    executeVerification();
  }, [token]);

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <Card title="Account Verification" className="text-center py-4">
          
          {/* State: Verifying */}
          {status === 'verifying' && (
            <div className="d-flex flex-column align-items-center gap-4 py-3">
              <Spinner size="lg" color="primary" />
              <p className="text-secondary mb-0">{message}</p>
            </div>
          )}

          {/* State: Success */}
          {status === 'success' && (
            <div className="d-flex flex-column align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white mb-2"
                style={{ width: '60px', height: '60px', backgroundColor: 'var(--accent-success-soft)' }}
              >
                <i className="bi bi-patch-check-fill text-success fs-1"></i>
              </div>
              <h3 className="h5 fw-bold text-success">Verified!</h3>
              <p className="text-secondary small mb-4">{message}</p>
              <Link to={ROUTES.LOGIN} className="w-100">
                <Button variant="primary" className="w-100">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* State: Failure */}
          {status === 'error' && (
            <div className="d-flex flex-column align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white mb-2"
                style={{ width: '60px', height: '60px', backgroundColor: 'var(--accent-danger-soft)' }}
              >
                <i className="bi bi-x-circle-fill text-danger fs-1"></i>
              </div>
              <h3 className="h5 fw-bold text-danger">Verification Failed</h3>
              <p className="text-secondary small mb-4">{message}</p>
              <Link to={ROUTES.REGISTER} className="w-100 mb-2">
                <Button variant="primary" className="w-100">
                  Try Registering Again
                </Button>
              </Link>
              <Link to={ROUTES.HOME} className="text-primary small text-decoration-none fw-medium">
                Back to Home
              </Link>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}
