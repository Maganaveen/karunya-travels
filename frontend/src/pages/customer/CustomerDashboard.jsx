import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  const activeTrips = bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const completedTrips = bookings.filter(b => b.status === 'completed');
  const pendingTrips = bookings.filter(b => b.status === 'pending');
  const totalSpent = completedTrips.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
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

  const buildTimeline = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.updatedAt || b.pickupDateTime) - new Date(a.updatedAt || a.pickupDateTime))
      .slice(0, 6)
      .map(b => {
        const labels = {
          pending: 'Booking placed',
          assigned: 'Driver assigned',
          started: 'Trip started',
          'in-progress': 'Trip in progress',
          completed: 'Trip completed'
        };
        return {
          label: `${labels[b.status] || b.status} — ${b.pickupLocation?.address || 'N/A'} → ${b.dropLocation?.address || 'N/A'}`,
          time: new Date(b.updatedAt || b.pickupDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          dot: timelineDot(b.status),
          icon: statusIcon(b.status)
        };
      });
  };

  const timeline = buildTimeline();

  return (
    <div className="cd-page">
      {/* ── Welcome Banner ── */}
      <div className="cd-welcome">
        <div className="cd-welcome-text">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Traveller'} 👋</h1>
          <p>Here's a quick look at your travel activity. Ready for the next adventure?</p>
        </div>
        <div className="cd-welcome-actions">
          <Link to="/start-journey" className="cd-btn cd-btn-light">
            <i className="fas fa-route"></i> Plan a Trip
          </Link>
          <Link to="/customer/bookings" className="cd-btn cd-btn-outline">
            <i className="fas fa-list-alt"></i> My Bookings
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="cd-stats">
        <div className="cd-stat-card">
          <div className="cd-stat-icon blue"><i className="fas fa-suitcase-rolling"></i></div>
          <div className="cd-stat-info">
            <h4>{bookings.length}</h4>
            <span>Total Bookings</span>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon green"><i className="fas fa-car-side"></i></div>
          <div className="cd-stat-info">
            <h4>{activeTrips.length}</h4>
            <span>Active Trips</span>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon purple"><i className="fas fa-flag-checkered"></i></div>
          <div className="cd-stat-info">
            <h4>{completedTrips.length}</h4>
            <span>Completed</span>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon orange"><i className="fas fa-wallet"></i></div>
          <div className="cd-stat-info">
            <h4>₹{totalSpent.toLocaleString('en-IN')}</h4>
            <span>Total Spent</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="cd-grid">
        {/* Left — Recent Bookings */}
        <div className="cd-section">
          <div className="cd-section-header">
            <h3><i className="fas fa-history"></i> Recent Bookings</h3>
            {bookings.length > 5 && (
              <Link to="/customer/bookings" className="cd-view-all">
                View All <i className="fas fa-arrow-right"></i>
              </Link>
            )}
          </div>

          {recentBookings.length === 0 ? (
            <div className="cd-empty">
              <i className="fas fa-car"></i>
              <p>No bookings yet.</p>
              <Link to="/start-journey">Plan your first trip →</Link>
            </div>
          ) : (
            <div className="cd-booking-list">
              {recentBookings.map(b => (
                <div key={b._id} className="cd-booking-row">
                  <div className={`cd-booking-icon ${b.status}`}>
                    <i className={`fas ${statusIcon(b.status)}`}></i>
                  </div>
                  <div className="cd-booking-details">
                    <div className="cd-booking-route">
                      {b.pickupLocation?.address || '—'} → {b.dropLocation?.address || '—'}
                    </div>
                    <div className="cd-booking-meta">
                      <span><i className="fas fa-calendar-alt"></i> {new Date(b.pickupDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span><i className="fas fa-road"></i> {b.totalDistance || 0} km</span>
                      {b.driverId?.name && <span><i className="fas fa-user"></i> {b.driverId.name}</span>}
                    </div>
                  </div>
                  <div className="cd-booking-right">
                    <div className="cd-booking-amount">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</div>
                    <span className={`cd-booking-status ${b.status}`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="cd-section">
            <div className="cd-section-header">
              <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
            </div>
            <div className="cd-quick-actions">
              <Link to="/start-journey" className="cd-quick-btn">
                <i className="fas fa-map-marked-alt"></i> Plan New Journey <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/customer/cars" className="cd-quick-btn">
                <i className="fas fa-car"></i> Browse Cars <i className="fas fa-chevron-right"></i>
              </Link>
              {/* <Link to="/customer/analytics" className="cd-quick-btn">
                <i className="fas fa-chart-pie"></i> Booking Analytics <i className="fas fa-chevron-right"></i>
              </Link> */}
              <Link to="/customer/bookings" className="cd-quick-btn">
                <i className="fas fa-receipt"></i> All Bookings <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Activity Timeline */}
          {timeline.length > 0 && (
            <div className="cd-section">
              <div className="cd-section-header">
                <h3><i className="fas fa-stream"></i> Activity</h3>
              </div>
              <div className="cd-timeline">
                {timeline.map((item, i) => (
                  <div key={i} className="cd-timeline-item">
                    <div className={`cd-timeline-dot ${item.dot}`}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div className="cd-timeline-content">
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

export default CustomerDashboard;
