import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

/**
 * MindVault Interactive Login Form Screen
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setErrors({ form: err.message || 'Authentication failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <Card
          title="Sign In"
          subtitle="Access your digital vault"
          footer={
            <div className="text-center text-secondary small">
              {"Don't have an account?"}{' '}
              <Link to={ROUTES.REGISTER} className="text-primary fw-medium text-decoration-none">
                Sign Up
              </Link>
            </div>
          }
        >
          {errors.form && (
            <div className="alert alert-danger text-center small py-2.5 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              disabled={isLoading}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isLoading}
              helperText="Must contain at least 8 characters."
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  style={{ cursor: 'pointer' }}
                />
                <label
                  className="form-check-label text-secondary small"
                  htmlFor="rememberMe"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Remember session
                </label>
              </div>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary small text-decoration-none fw-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2.5"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
