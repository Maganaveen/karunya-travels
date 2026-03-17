import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, bookingsAPI, carsAPI, driversAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [, bookingsRes, carsRes, driversRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        bookingsAPI.getAllBookings(),
        carsAPI.getAllAdmin(),
        driversAPI.getAllDrivers()
      ]);
      setBookings(bookingsRes.data || []);
      setCars(carsRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const getFilteredBookings = () => {
    if (activeTab === 'active') return activeBookings;
    if (activeTab === 'completed') return completedBookings;
    if (activeTab === 'pending') return pendingBookings;
    return bookings;
  };

  const getStatusIcon = (status) => {
    const icons = { pending: 'fa-clock', assigned: 'fa-user-check', started: 'fa-play', 'in-progress': 'fa-route', completed: 'fa-check-circle' };
    return icons[status] || 'fa-clock';
  };

  if (loading) {
    return (
      <div className="ad-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="ad-page">
      {/* Welcome Banner */}
      <div className="ad-welcome">
        <div className="ad-welcome-text">
          <h1>Admin Dashboard</h1>
          <p>Manage bookings, fleet, and drivers — all in one place.</p>
        </div>
        <div className="ad-welcome-actions">
          <Link to="/admin/bookings" className="ad-btn ad-btn-light">
            <i className="fas fa-calendar-alt"></i> Bookings
          </Link>
          <Link to="/admin/cars" className="ad-btn ad-btn-outline">
            <i className="fas fa-car"></i> Fleet
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="ad-stats">
        <div className="ad-stat-card">
          <div className="ad-stat-icon blue"><i className="fas fa-calendar-check"></i></div>
          <div className="ad-stat-info">
            <h4>{bookings.length}</h4>
            <span>Total Bookings</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon green"><i className="fas fa-rupee-sign"></i></div>
          <div className="ad-stat-info">
            <h4>₹{totalRevenue.toLocaleString()}</h4>
            <span>Total Revenue</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon purple"><i className="fas fa-id-badge"></i></div>
          <div className="ad-stat-info">
            <h4>{drivers.length}</h4>
            <span>Drivers</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon orange"><i className="fas fa-car-side"></i></div>
          <div className="ad-stat-info">
            <h4>{cars.length}</h4>
            <span>Fleet Size</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="ad-grid">
        {/* Left — Bookings List */}
        <div className="ad-section">
          <div className="ad-section-header">
            <h3><i className="fas fa-list-alt"></i> Bookings</h3>
            <div className="ad-tab-group">
              {['all', 'active', 'pending', 'completed'].map(tab => (
                <button key={tab} className={`ad-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="ad-booking-list">
            {getFilteredBookings().length === 0 ? (
              <div className="ad-empty">
                <i className="fas fa-inbox"></i>
                <p>No {activeTab !== 'all' ? activeTab : ''} bookings found</p>
              </div>
            ) : (
              getFilteredBookings().slice(0, 8).map(booking => (
                <div className="ad-booking-row" key={booking._id}>
                  <div className={`ad-booking-icon ${booking.status}`}>
                    <i className={`fas ${getStatusIcon(booking.status)}`}></i>
                  </div>
                  <div className="ad-booking-details">
                    <div className="ad-booking-route">
                      {booking.pickupLocation?.address || 'Pickup'} → {booking.dropLocation?.address || 'Drop'}
                    </div>
                    <div className="ad-booking-meta">
                      <span><i className="fas fa-user"></i> {booking.userId?.name || 'Unknown'}</span>
                      <span><i className="fas fa-steering-wheel"></i> {booking.driverId?.name || 'Unassigned'}</span>
                      <span><i className="fas fa-car"></i> {booking.carId?.name || '—'}</span>
                    </div>
                  </div>
                  <div className="ad-booking-right">
                    <div className="ad-booking-amount">₹{booking.totalAmount?.toLocaleString() || 0}</div>
                    <div className={`ad-booking-status ${booking.status}`}>{booking.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Revenue Summary */}
          <div className="ad-section">
            <div className="ad-section-header">
              <h3><i className="fas fa-chart-pie"></i> Revenue</h3>
            </div>
            <div className="ad-revenue">
              <div className="ad-revenue-total">
                <span>Total Earned</span>
                <h3>₹{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="ad-revenue-breakdown">
                <div className="ad-revenue-item">
                  <span className="ad-revenue-label"><i className="fas fa-circle" style={{ color: '#10b981' }}></i> Completed</span>
                  <span className="ad-revenue-value">{completedBookings.length}</span>
                </div>
                <div className="ad-revenue-item">
                  <span className="ad-revenue-label"><i className="fas fa-circle" style={{ color: '#8b5cf6' }}></i> Active</span>
                  <span className="ad-revenue-value">{activeBookings.length}</span>
                </div>
                <div className="ad-revenue-item">
                  <span className="ad-revenue-label"><i className="fas fa-circle" style={{ color: '#f59e0b' }}></i> Pending</span>
                  <span className="ad-revenue-value">{pendingBookings.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cars in Rent */}
          <div className="ad-section">
            <div className="ad-section-header">
              <h3><i className="fas fa-car"></i> Cars in Rent</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeBookings.length} active</span>
            </div>
            {activeBookings.length === 0 ? (
              <div className="ad-empty">
                <i className="fas fa-parking"></i>
                <p>No cars currently rented</p>
              </div>
            ) : (
              activeBookings.slice(0, 4).map(b => (
                <div className="ad-fleet-row" key={b._id}>
                  <div className="ad-fleet-icon"><i className="fas fa-car"></i></div>
                  <div className="ad-fleet-details">
                    <div className="ad-fleet-name">{b.carId?.name || 'Unknown Car'}</div>
                    <div className="ad-fleet-meta">{b.driverId?.name || 'No driver'} • {b.userId?.name || 'Unknown'}</div>
                  </div>
                  <div className={`ad-booking-status ${b.status}`}>{b.status}</div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="ad-section">
            <div className="ad-section-header">
              <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
            </div>
            <div className="ad-quick-actions">
              <Link to="/admin/bookings" className="ad-quick-btn">
                <i className="fas fa-calendar-alt"></i> Manage Bookings <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/admin/drivers" className="ad-quick-btn">
                <i className="fas fa-id-badge"></i> Manage Drivers <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/admin/cars" className="ad-quick-btn">
                <i className="fas fa-car-side"></i> Manage Fleet <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/admin/reports" className="ad-quick-btn">
                <i className="fas fa-chart-bar"></i> View Reports <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
