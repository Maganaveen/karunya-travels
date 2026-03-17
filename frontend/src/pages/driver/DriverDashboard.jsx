import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  const fetchDriverBookings = async () => {
    try {
      const response = await bookingsAPI.getDriverBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch assigned bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dd-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0) * 0.7, 0);
  const recentBookings = [...bookings].sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime)).slice(0, 5);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statusIcon = (status) => {
    const map = { pending: 'fa-clock', assigned: 'fa-user-check', started: 'fa-play-circle', 'in-progress': 'fa-route', completed: 'fa-check-circle' };
    return map[status] || 'fa-circle';
  };

  const timelineDot = (status) => {
    const map = { pending: 'yellow', assigned: 'blue', started: 'purple', 'in-progress': 'purple', completed: 'green' };
    return map[status] || 'blue';
  };

  const buildTimeline = () =>
    [...bookings]
      .sort((a, b) => new Date(b.updatedAt || b.pickupDateTime) - new Date(a.updatedAt || a.pickupDateTime))
      .slice(0, 6)
      .map(b => {
        const labels = { pending: 'Booking placed', assigned: 'Assigned to you', started: 'Trip started', 'in-progress': 'Trip in progress', completed: 'Trip completed' };
        return {
          label: `${labels[b.status] || b.status} — ${b.pickupLocation?.address || 'N/A'} → ${b.dropLocation?.address || 'N/A'}`,
          time: new Date(b.updatedAt || b.pickupDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          dot: timelineDot(b.status),
          icon: statusIcon(b.status)
        };
      });

  const timeline = buildTimeline();

  return (
    <div className="dd-page">
      {/* ── Welcome Banner ── */}
      <div className="dd-welcome">
        <div className="dd-welcome-text">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Driver'} 🚗</h1>
          <p>Here's your trip summary. Stay online to receive new orders!</p>
          <div className={`dd-availability ${activeBookings.length > 0 ? 'online' : 'offline'}`}>
            <span className="dd-availability-dot"></span>
            {activeBookings.length > 0 ? `${activeBookings.length} Active Trip${activeBookings.length > 1 ? 's' : ''}` : 'No Active Trips'}
          </div>
        </div>
        <div className="dd-welcome-actions">
          <Link to="/driver/location" className="dd-btn dd-btn-light">
            <i className="fas fa-map-marker-alt"></i> My Location
          </Link>
          <Link to="/driver/bookings" className="dd-btn dd-btn-outline">
            <i className="fas fa-list-alt"></i> All Orders
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dd-stats">
        <div className="dd-stat-card">
          <div className="dd-stat-icon teal"><i className="fas fa-clipboard-list"></i></div>
          <div className="dd-stat-info">
            <h4>{bookings.length}</h4>
            <span>Total Orders</span>
          </div>
        </div>
        <div className="dd-stat-card">
          <div className="dd-stat-icon green"><i className="fas fa-car-side"></i></div>
          <div className="dd-stat-info">
            <h4>{activeBookings.length}</h4>
            <span>Active Trips</span>
          </div>
        </div>
        <div className="dd-stat-card">
          <div className="dd-stat-icon purple"><i className="fas fa-flag-checkered"></i></div>
          <div className="dd-stat-info">
            <h4>{completedBookings.length}</h4>
            <span>Completed</span>
          </div>
        </div>
        <div className="dd-stat-card">
          <div className="dd-stat-icon amber"><i className="fas fa-wallet"></i></div>
          <div className="dd-stat-info">
            <h4>₹{totalEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h4>
            <span>Total Earnings</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="dd-grid">
        {/* Left — Recent Orders */}
        <div className="dd-section">
          <div className="dd-section-header">
            <h3><i className="fas fa-history"></i> Recent Orders</h3>
            {bookings.length > 5 && (
              <Link to="/driver/bookings" className="dd-view-all">
                View All <i className="fas fa-arrow-right"></i>
              </Link>
            )}
          </div>

          {recentBookings.length === 0 ? (
            <div className="dd-empty">
              <i className="fas fa-inbox"></i>
              <p>No orders assigned yet.</p>
              <Link to="/driver/location">Update your location to get orders →</Link>
            </div>
          ) : (
            <div className="dd-booking-list">
              {recentBookings.map(b => (
                <Link key={b._id} to={`/driver/bookings#${b._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="dd-booking-row">
                    <div className={`dd-booking-icon ${b.status}`}>
                      <i className={`fas ${statusIcon(b.status)}`}></i>
                    </div>
                    <div className="dd-booking-details">
                      <div className="dd-booking-route">
                        {b.pickupLocation?.address || '—'} → {b.dropLocation?.address || '—'}
                      </div>
                      <div className="dd-booking-meta">
                        <span><i className="fas fa-calendar-alt"></i> {new Date(b.pickupDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span><i className="fas fa-road"></i> {b.totalDistance || 0} km</span>
                        <span><i className="fas fa-user"></i> {b.customerId?.name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="dd-booking-right">
                      <div className="dd-booking-amount">₹{((b.totalAmount || 0) * 0.7).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      <span className={`dd-booking-status ${b.status}`}>{b.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="dd-section">
            <div className="dd-section-header">
              <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
            </div>
            <div className="dd-quick-actions">
              <Link to="/driver/bookings" className="dd-quick-btn">
                <i className="fas fa-tasks"></i> Manage Orders <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/driver/location" className="dd-quick-btn">
                <i className="fas fa-map-pin"></i> Update Location <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Activity Timeline */}
          {timeline.length > 0 && (
            <div className="dd-section">
              <div className="dd-section-header">
                <h3><i className="fas fa-stream"></i> Activity</h3>
              </div>
              <div className="dd-timeline">
                {timeline.map((item, i) => (
                  <div key={i} className="dd-timeline-item">
                    <div className={`dd-timeline-dot ${item.dot}`}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div className="dd-timeline-content">
                      <p>{item.label}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
