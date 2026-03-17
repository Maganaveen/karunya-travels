import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const watchRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.register({ ...data, role: 'customer' });
      const { token, user } = response.data;

      login(token, user);
      toast.success('Registration successful!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="login-overlay"></div>
      
      <div className="login-container">
        <div className="login-modal register-modal">
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
            <span className="logo-text">Karumya</span>
          </div>

          <div className="login-content">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Join our community and start your journey</p>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-circle"></i> {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
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
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter your phone number"
                    {...register('phone', { required: 'Phone is required' })}
                  />
                </div>
                {errors.phone && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-circle"></i> {errors.phone.message}
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
                    placeholder="Create a password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="error-text">
                    <i className="fas fa-exclamation-circle"></i> {errors.password.message}
                  </span>
                )}
              </div>

              <label className="terms-agree">
                <input type="checkbox" required />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i> Create Account
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Already have an account? 
                <Link to="/login" className="signup-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;