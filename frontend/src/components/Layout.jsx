import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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

  if (!user) {
    return <div>{children}</div>;
  }

  const navLinks = getNavLinks();

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-car"></i>
            </div>
            {!sidebarCollapsed && <span className="logo-text">Karunya</span>}
          </div>
        </div>

        <div className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <i className={link.icon}></i>
              {!sidebarCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <button
            className="sidebar-toggle"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="top-bar-right">
            <div className="user-profile">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>{user.name}</span>
                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{user.role.toUpperCase()}</span>
              </div>
              <span className="status-badge status-completed" style={{ fontSize: '0.7rem', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '0.4rem' }}></i>ACTIVE
              </span>
            </div>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
