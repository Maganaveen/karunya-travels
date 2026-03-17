import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
a
const Rentals = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [statusFilter, bookings]);

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

  const filterBookings = () => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      assigned: 'status-assigned',
      started: 'status-started',
      'in-progress': 'status-started',
      completed: 'status-completed'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>Loading rentals...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="page-header">
          <h1>My Rentals</h1>
          <p>Track all your car rentals and bookings</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-lock" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
          <h2>Sign In Required</h2>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            Please log in to view your rental history and bookings.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleLoginRedirect}
            style={{ padding: '0.75rem 2rem' }}
          >
            <i className="fas fa-sign-in-alt"></i> Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1>My Rentals</h1>
        <p>Track all your car rentals and bookings</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Filter by Status</h3>
          <div className="filter-buttons" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({bookings.length})
            </button>
            <button
              className={`btn ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              className={`btn ${statusFilter === 'assigned' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('assigned')}
            >
              Assigned ({bookings.filter(b => b.status === 'assigned').length})
            </button>
            <button
              className={`btn ${statusFilter === 'started' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('started')}
            >
              In Progress ({bookings.filter(b => ['started', 'in-progress'].includes(b.status)).length})
            </button>
            <button
              className={`btn ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ color: '#6c757d' }}>
              No rentals found for this status.
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Car Details</th>
                  <th>Trip Details</th>
                  <th>Driver</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>#{booking._id.slice(-6)}</td>
                    <td>
                      <div>
                        <strong>{booking.carId?.name}</strong><br />
                        <small style={{ color: '#6c757d' }}>{booking.carId?.number}</small>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        <strong>From:</strong> {booking.pickupLocation.address}<br />
                        <strong>To:</strong> {booking.dropLocation.address}<br />
                        {booking.placesToVisit && booking.placesToVisit.length > 0 && (
                          <>
                            <strong>Via:</strong> {booking.placesToVisit.map(p => p.address).join(', ')}<br />
                          </>
                        )}
                        <strong>Distance:</strong> {booking.totalDistance} km
                      </div>
                    </td>
                    <td>
                      {booking.driverId ? (
                        <div style={{ fontSize: '0.9rem' }}>
                          <strong>{booking.driverId.name}</strong><br />
                          <small style={{ color: '#6c757d' }}>{booking.driverId.phone}</small>
                        </div>
                      ) : (
                        <span style={{ color: '#6c757d' }}>Not Assigned</span>
                      )}
                    </td>
                    <td>₹{booking.totalAmount}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(booking.pickupDateTime).toLocaleDateString()}<br />
                      <small style={{ color: '#6c757d' }}>{new Date(booking.pickupDateTime).toLocaleTimeString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
