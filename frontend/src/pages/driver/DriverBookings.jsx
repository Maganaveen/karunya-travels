import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DriverBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  const fetchDriverBookings = async () => {
    try {
      const response = await bookingsAPI.getDriverBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchDriverBookings();
    } catch (error) {
      toast.error('Failed to update order status');
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

  return (
    <div className="container">
      <h2>My Orders</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {bookings.length === 0 ? (
          <div className="card">
            <p>No orders assigned yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div 
              key={booking._id}
              className="card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => setSelectedBooking(booking)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{booking.customerId?.name}</h3>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
                    {booking.customerId?.phone}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#999' }}>Car</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {booking.carId?.name} ({booking.carId?.number})
                  </p>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#999' }}>Pickup Location</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {booking.pickupLocation?.address}
                  </p>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#999' }}>Drop Location</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {booking.dropLocation?.address}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#999' }}>Pickup Time</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {formatDateTime(booking.pickupDateTime)}
                  </p>
                </div>
              </div>

              {booking.placesToVisit && booking.placesToVisit.length > 0 && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>
                    Places to Visit ({booking.placesToVisit.length})
                  </p>
                  {booking.placesToVisit.map((place, idx) => (
                    <p key={idx} style={{ margin: '4px 0', fontSize: '0.9rem', color: '#555' }}>
                      {idx + 1}. {place.address}
                    </p>
                  ))}
                </div>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '10px 0',
                borderTop: '1px solid #eee',
                fontSize: '0.9rem'
              }}>
                <div>
                  <p style={{ margin: '0', color: '#999' }}>Distance</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>{booking.totalDistance} km</p>
                </div>
                <div>
                  <p style={{ margin: '0', color: '#999' }}>Amount</p>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#28a745' }}>₹{booking.totalAmount}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Order Details</h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> {selectedBooking.customerId?.name}</p>
              <p><strong>Phone:</strong> {selectedBooking.customerId?.phone}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>Vehicle Details</h4>
              <p><strong>Car:</strong> {selectedBooking.carId?.name}</p>
              <p><strong>Number:</strong> {selectedBooking.carId?.number}</p>
              <p><strong>Model:</strong> {selectedBooking.carId?.model}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>Route Information</h4>
              <p><strong>Pickup Location:</strong> {selectedBooking.pickupLocation?.address}</p>
              <p><strong>Drop Location:</strong> {selectedBooking.dropLocation?.address}</p>
              <p><strong>Pickup DateTime:</strong> {formatDateTime(selectedBooking.pickupDateTime)}</p>
              <p><strong>Total Distance:</strong> {selectedBooking.totalDistance} km</p>
              <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}</p>
            </div>

            {selectedBooking.placesToVisit && selectedBooking.placesToVisit.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Places to Visit</h4>
                {selectedBooking.placesToVisit.map((place, idx) => (
                  <p key={idx} style={{ margin: '5px 0' }}>
                    {idx + 1}. {place.address}
                  </p>
                ))}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4>Order Status</h4>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Update Status</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedBooking.status === 'assigned' && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking._id, 'started')}
                      className="btn btn-primary"
                    >
                      Start Journey
                    </button>
                  )}
                  {['started', 'in-progress'].includes(selectedBooking.status) && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking._id, 'in-progress')}
                      className="btn btn-primary"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedBooking.status !== 'pending' && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking._id, 'completed')}
                      className="btn btn-success"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button 
                    onClick={() => updateBookingStatus(selectedBooking._id, 'cancelled')}
                    className="btn btn-danger"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setSelectedBooking(null)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverBookings;
