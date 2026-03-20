import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <i className="fas fa-car"></i>
          </div>
          <span>Karunya</span>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/available-cars" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Available Cars</Link>
          <Link to="/about-us" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/rentals" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Rentals</Link>
          <Link to="/conditions" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>Conditions</Link>
          {!user && <Link to="/login" className="navbar-link mobile-only" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>}
          {!user && <Link to="/register" className="navbar-link mobile-only" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>}
        </div>

        <div className="navbar-actions">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span>{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-link desktop-only">Login</Link>
              <Link to="/register" className="btn btn-primary navbar-btn desktop-only">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;