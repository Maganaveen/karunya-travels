import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const sampleCredentials = [
    { role: 'Admin', email: 'admin@carrental.com', password: 'admin123' },
    { role: 'Customer', email: 'customer@example.com', password: 'customer123' },
    { role: 'Driver', email: 'driver@example.com', password: 'driver123' }
  ];

  const fillCredentials = (email, password) => {
    document.querySelector('input[name="email"]').value = email;
    document.querySelector('input[name="password"]').value = password;
  };

  const { isAuthenticated, user: authUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && authUser?.role) {
      const path = authUser.role === 'admin' ? '/admin/dashboard' : authUser.role === 'driver' ? '/driver/dashboard' : '/customer/dashboard';
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data);
      const { token, user } = response.data || {};

      if (!token || !user) {
        toast.error('Login failed: Invalid response from server');
        return;
      }

      login(token, user);
      toast.success('Login successful!');

      const path = user.role === 'admin' ? '/admin/dashboard' : user.role === 'driver' ? '/driver/dashboard' : '/customer/dashboard';
      navigate(path, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      
      <div className="login-container">
        <div className="login-modal">
          <div className="login-header">
            <button 
              className="back-home-btn" 
              onClick={() => navigate('/')}
              title="Back to Home"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button 
              className="close-btn" 
              onClick={() => navigate('/')}
              title="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="login-logo">
            <div className="logo-icon">
              <i className="fas fa-car"></i>
            </div>
            <span className="logo-text">Karunya</span>
          </div>

          <div className="login-content">
            <h2 className="login-title">Welcome Back!</h2>
            <p className="login-subtitle">Your journey begins here</p>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label>Name or Email</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name or email"
                    {...register('email', { 
                      required: 'Name or email is required'
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-circle"></i> {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    {...register('password', { required: 'Password is required' })}
                  />
                </div>
                {errors.password && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-circle"></i> {errors.password.message}
                  </span>
                )}
              </div>

              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <div className="divider">
                <span>or</span>
              </div>
              <p>
                Don't have an account yet? 
                <Link to="/register" className="signup-link">
                  Create an account
                </Link>
              </p>
              <div className="help-links">
                <a href="#" className="help-link">Forgot Password?</a>
                <span className="separator">•</span>
                <a href="#" className="help-link">Need Help?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;