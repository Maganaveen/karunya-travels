import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CustomerBookings = () => {
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
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="card">
          <p>No bookings found. <a href="/customer/cars">Book your first car!</a></p>
        </div>
      ) : (
        <div className="card">
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
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>#{booking._id.slice(-6)}</td>
                  <td>
                    <div>
                      <strong>{booking.carId?.name}</strong><br />
                      <small>{booking.carId?.number}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>From:</strong> {booking.pickupLocation.address}<br />
                      <strong>To:</strong> {booking.dropLocation.address}<br />
                      {booking.placesToVisit.length > 0 && (
                        <>
                          <strong>Via:</strong> {booking.placesToVisit.map(p => p.address).join(', ')}<br />
                        </>
                      )}
                      <strong>Distance:</strong> {booking.totalDistance} km
                    </div>
                  </td>
                  <td>
                    {booking.driverId ? (
                      <div>
                        <strong>{booking.driverId.name}</strong><br />
                        <small>{booking.driverId.phone}</small>
                      </div>
                    ) : (
                      <span style={{ color: '#6c757d' }}>Not Assigned</span>
                    )}
                  </td>
                  <td>₹{booking.totalAmount}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    {new Date(booking.pickupDateTime).toLocaleDateString()}<br />
                    <small>{new Date(booking.pickupDateTime).toLocaleTimeString()}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;