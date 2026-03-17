import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      assigned: 'status-assigned',
      started: 'status-started',
      'in-progress': 'status-started',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div>Loading...</div>;

  const activeBookings = bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="container">
      <h2>Driver Dashboard</h2>
      
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h3>Total Orders</h3>
          <h2 style={{ color: '#007bff' }}>{bookings.length}</h2>
        </div>
        <div className="card">
          <h3>Active Orders</h3>
          <h2 style={{ color: '#28a745' }}>{activeBookings.length}</h2>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <h2 style={{ color: '#6c757d' }}>{completedBookings.length}</h2>
        </div>
        <div className="card">
          <h3>Total Earnings</h3>
          <h2 style={{ color: '#dc3545' }}>
            ₹{completedBookings.reduce((sum, b) => sum + (b.totalAmount * 0.7), 0).toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="card">
        <h3>Assigned Orders</h3>
        {bookings.length === 0 ? (
          <p>No orders assigned yet. <a href="/driver/location">Update your location</a> to get orders.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Car</th>
                  <th>Pickup Location</th>
                  <th>Drop Location</th>
                  <th>Pickup Time</th>
                  <th>Distance</th>
                  <th>Places to Visit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                          {booking.customerId?.name || 'N/A'}
                        </p>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                          {booking.customerId?.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                          {booking.carId?.name || 'N/A'}
                        </p>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                          {booking.carId?.number || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td>{booking.pickupLocation?.address || 'N/A'}</td>
                    <td>{booking.dropLocation?.address || 'N/A'}</td>
                    <td>{formatDateTime(booking.pickupDateTime)}</td>
                    <td>{booking.totalDistance} km</td>
                    <td>
                      {booking.placesToVisit && booking.placesToVisit.length > 0 ? (
                        <div style={{ fontSize: '0.9rem' }}>
                          {booking.placesToVisit.slice(0, 2).map((place, idx) => (
                            <p key={idx} style={{ margin: '3px 0', color: '#555' }}>
                              • {place.address}
                            </p>
                          ))}
                          {booking.placesToVisit.length > 2 && (
                            <p style={{ margin: '3px 0', color: '#999' }}>
                              +{booking.placesToVisit.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>—</span>
                      )}
                    </td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <a 
                        href={`/driver/bookings#${booking._id}`}
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
