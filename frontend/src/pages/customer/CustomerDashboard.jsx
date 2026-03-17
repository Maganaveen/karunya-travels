import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Customer Dashboard</h2>
      
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h3>Total Bookings</h3>
          <h2 style={{ color: '#007bff' }}>{bookings.length}</h2>
        </div>
        <div className="card">
          <h3>Active Trips</h3>
          <h2 style={{ color: '#28a745' }}>
            {bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status)).length}
          </h2>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <h2 style={{ color: '#6c757d' }}>
            {bookings.filter(b => b.status === 'completed').length}
          </h2>
        </div>
        <div className="card">
          <h3>Total Spent</h3>
          <h2 style={{ color: '#dc3545' }}>
            ₹{bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0)}
          </h2>
        </div>
      </div>

      <div className="card">
        <h3>Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings found. <a href="/customer/cars">Book your first car!</a></p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Driver</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.carId?.name} ({booking.carId?.number})</td>
                  <td>{booking.pickupLocation.address}</td>
                  <td>{booking.dropLocation.address}</td>
                  <td>{new Date(booking.pickupDateTime).toLocaleDateString()}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>{booking.driverId?.name || 'Not Assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;