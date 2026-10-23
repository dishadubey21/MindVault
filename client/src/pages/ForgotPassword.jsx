import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import authService from '../services/authService';

/**
 * Forgot Password Request Screen
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Email address is required.');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setSuccessMessage(response.message || 'If that account exists, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <Card
          title="Recover Password"
          subtitle="Receive password reset instructions"
          footer={
            <div className="text-center text-secondary small">
              Back to{' '}
              <Link to={ROUTES.LOGIN} className="text-primary fw-medium text-decoration-none">
                Sign In
              </Link>
            </div>
          }
        >
          {successMessage ? (
            <div className="alert alert-success text-center mb-0" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="text-secondary small mb-4">
                Enter your email address below, and we will send you a link to reset your account password.
              </p>

              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2.5 mt-2"
                loading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
