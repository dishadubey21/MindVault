import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import authService from '../services/authService';

/**
 * Reset Password Override Screen
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'New password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      setErrors({ form: 'Reset token is missing from the URL.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, formData.password);
      setSuccessMessage(response.message || 'Your password has been successfully updated.');
      setFormData({ password: '', confirmPassword: '' });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to reset password. Link may be invalid or expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <Card
          title="Reset Password"
          subtitle="Configure your new account password"
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
              {errors.form && (
                <div className="alert alert-danger text-center small py-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.form}
                </div>
              )}

              <Input
                name="password"
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={isLoading}
              />

              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2.5 mt-2"
                loading={isLoading}
              >
                Reset Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
