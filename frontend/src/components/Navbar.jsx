import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getNavLinks = () => {
    if (!user) return null;

    const linkClass = (path) =>
      `nav-item ${isActive(path)} ${location.pathname === path ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`;

    switch (user.role) {
      case 'customer':
        return (
          <>
            <Link to="/customer/dashboard" className={linkClass('/customer/dashboard')}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/start-journey" className={linkClass('/start-journey')}>
              <i className="fas fa-route"></i> Start Journey
            </Link>
            <Link to="/customer/cars" className={linkClass('/customer/cars')}>
              <i className="fas fa-car"></i> Book Car
            </Link>
            <Link to="/customer/bookings" className={linkClass('/customer/bookings')}>
              <i className="fas fa-list"></i> Bookings
            </Link>
          </>
        );
      case 'driver':
        return (
          <>
            <Link to="/driver/dashboard" className={linkClass('/driver/dashboard')}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/driver/bookings" className={linkClass('/driver/bookings')}>
              <i className="fas fa-route"></i> Trips
            </Link>
            <Link to="/driver/location" className={linkClass('/driver/location')}>
              <i className="fas fa-map-marker-alt"></i> Location
            </Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/admin/cars" className={linkClass('/admin/cars')}>
              <i className="fas fa-car"></i> Cars
            </Link>
            <Link to="/admin/drivers" className={linkClass('/admin/drivers')}>
              <i className="fas fa-id-card"></i> Drivers
            </Link>
            <Link to="/admin/bookings" className={linkClass('/admin/bookings')}>
              <i className="fas fa-calendar"></i> Bookings
            </Link>
            <Link to="/admin/users" className={linkClass('/admin/users')}>
              <i className="fas fa-users"></i> Users
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem 0', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <div style={{ background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(67, 97, 238, 0.3)' }}>
            <i className="fas fa-car" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <span className="text-gradient">Karunya</span>
        </Link>

        {user ? (
          <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {getNavLinks()}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <i className="fas fa-user"></i>
              </div>
              <span style={{ color: 'white', fontSize: '0.9rem' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-icon" style={{ background: 'rgba(229, 57, 53, 0.2)', color: '#e53935', border: 'none', width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', transition: 'all 0.2s' }}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem' }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem' }}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;