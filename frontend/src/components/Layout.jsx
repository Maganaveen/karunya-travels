import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'customer':
        return [
          { path: '/customer/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
          { path: '/start-journey', icon: 'fas fa-route', label: 'Start Journey' },
          { path: '/customer/cars', icon: 'fas fa-car', label: 'Available Cars' },
          { path: '/customer/bookings', icon: 'fas fa-calendar-check', label: 'Bookings' },
        ];
      case 'driver':
        return [
          { path: '/driver/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
          { path: '/driver/bookings', icon: 'fas fa-route', label: 'My Bookings' },
          { path: '/driver/location', icon: 'fas fa-map-marker-alt', label: 'Location' },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
          { path: '/admin/cars', icon: 'fas fa-car', label: 'Cars' },
          { path: '/admin/drivers', icon: 'fas fa-id-card', label: 'Drivers' },
          { path: '/admin/bookings', icon: 'fas fa-calendar', label: 'Bookings' },
          { path: '/admin/users', icon: 'fas fa-users', label: 'Users' },
        ];
      default:
        return [];
    }
  };

  if (!user) return <div>{children}</div>;

  const navLinks = getNavLinks();
  const roleIcon = user.role === 'admin' ? 'fa-shield-alt' : user.role === 'driver' ? 'fa-steering-wheel' : 'fa-user';

  return (
    <div className="layout-topbar">
      <header className="topnav">
        <div className="topnav-inner">
          {/* Logo */}
          <Link to="/" className="topnav-logo">
            <div className="topnav-logo-icon">
              <i className="fas fa-car"></i>
            </div>
            <div className="topnav-logo-text">
              <span className="topnav-brand">Karunya</span>
              <span className="topnav-brand-sub">Travels</span>
            </div>
          </Link>

          <div className="topnav-separator"></div>

          {/* Desktop Nav Links */}
          <nav className="topnav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`topnav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className="topnav-link-icon"><i className={link.icon}></i></span>
                <span className="topnav-link-label">{link.label}</span>
                {isActive(link.path) && <span className="topnav-link-indicator"></span>}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="topnav-actions">
            <div className="topnav-separator"></div>

            {/* User Menu */}
            <div className="topnav-user-wrap" ref={dropdownRef}>
              <button
                className={`topnav-user-btn ${userDropdownOpen ? 'open' : ''}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="topnav-avatar">
                  <span className="topnav-avatar-text">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                  <span className="topnav-avatar-status"></span>
                </div>
                <div className="topnav-user-info">
                  <span className="topnav-user-name">{user.name}</span>
                  <span className="topnav-user-role">
                    <i className={`fas ${roleIcon}`}></i>
                    {user.role}
                  </span>
                </div>
                <i className={`fas fa-chevron-down topnav-chevron ${userDropdownOpen ? 'open' : ''}`}></i>
              </button>

              {userDropdownOpen && (
                <div className="topnav-dropdown">
                  <div className="topnav-dropdown-header">
                    <div className="topnav-dropdown-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="topnav-dropdown-name">{user.name}</div>
                      <div className="topnav-dropdown-email">{user.email || user.role}</div>
                    </div>
                  </div>
                  <div className="topnav-dropdown-divider"></div>
                  <Link to="/profile" className="topnav-dropdown-item">
                    <i className="fas fa-user-cog"></i>
                    <span>My Profile</span>
                  </Link>
                  <div className="topnav-dropdown-divider"></div>
                  <button onClick={handleLogout} className="topnav-dropdown-item danger">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className={`topnav-hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="topnav-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <nav className={`topnav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="topnav-mobile-header">
          <div className="topnav-mobile-user">
            <div className="topnav-mobile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <div className="topnav-mobile-name">{user.name}</div>
              <div className="topnav-mobile-role"><i className={`fas ${roleIcon}`}></i> {user.role}</div>
            </div>
          </div>
        </div>
        <div className="topnav-mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`topnav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <span className="topnav-mobile-link-icon"><i className={link.icon}></i></span>
              <span>{link.label}</span>
              {isActive(link.path) && <i className="fas fa-chevron-right topnav-mobile-arrow"></i>}
            </Link>
          ))}
          <Link to="/profile" className={`topnav-mobile-link ${isActive('/profile') ? 'active' : ''}`}>
            <span className="topnav-mobile-link-icon"><i className="fas fa-user-cog"></i></span>
            <span>Profile</span>
            {isActive('/profile') && <i className="fas fa-chevron-right topnav-mobile-arrow"></i>}
          </Link>
        </div>
        <div className="topnav-mobile-footer">
          <button onClick={handleLogout} className="topnav-mobile-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="topbar-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
