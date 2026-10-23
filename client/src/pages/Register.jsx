import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

/**
 * MindVault Interactive Register Form Screen
 */
export default function Register() {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
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
    if (!formData.username) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores.';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, numbers, and a special character.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(formData.username, formData.email, formData.password);
      setSuccessMessage(response.message || 'Registration successful! Verification email has been sent.');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <Card
          title="Create Account"
          subtitle="Start indexing your ideas"
          footer={
            <div className="text-center text-secondary small">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary fw-medium text-decoration-none">
                Sign In
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

          {successMessage ? (
            <div className="alert alert-success text-center mb-0 py-3" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-5 d-block mb-2"></i>
              <span>{successMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Input
                name="username"
                label="Username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
                disabled={isLoading}
              />

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
                className="w-100 py-2.5 mt-3"
                loading={isLoading}
              >
                Sign Up
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
