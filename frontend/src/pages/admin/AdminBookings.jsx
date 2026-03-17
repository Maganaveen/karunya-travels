import React, { useState, useEffect } from 'react';
import { bookingsAPI, driversAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningDriver, setAssigningDriver] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsResponse, driversResponse] = await Promise.all([
        bookingsAPI.getAllBookings(),
        driversAPI.getAllDrivers()
      ]);
      
      setBookings(bookingsResponse.data);
      setDrivers(driversResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const assignDriver = async (bookingId, driverId) => {
    try {
      await bookingsAPI.assignDriver(bookingId, driverId);
      toast.success('Driver assigned successfully');
      fetchData(); // Refresh data
      setAssigningDriver(null);
    } catch (error) {
      toast.error('Failed to assign driver');
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

  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.isAvailable && driver.isActive);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>All Bookings</h2>
      
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="card">
          <h3>Total Bookings</h3>
          <h2 style={{ color: '#007bff' }}>{bookings.length}</h2>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <h2 style={{ color: '#ffc107' }}>
            {bookings.filter(b => b.status === 'pending').length}
          </h2>
        </div>
        <div className="card">
          <h3>Active</h3>
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
      </div>

      <div className="card">
        <h3>Bookings List</h3>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Trip Details</th>
                <th>Driver</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>#{booking._id.slice(-6)}</td>
                  <td>
                    <div>
                      <strong>{booking.customerId?.name}</strong><br />
                      <small>{booking.customerId?.email}</small><br />
                      <small>{booking.customerId?.phone}</small>
                    </div>
                  </td>
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
                        <small>{booking.driverId.email}</small><br />
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
                  <td>
                    {booking.status === 'pending' && !booking.driverId && (
                      <div>
                        {assigningDriver === booking._id ? (
                          <div>
                            <select
                              className="form-control"
                              style={{ marginBottom: '5px', fontSize: '12px' }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignDriver(booking._id, e.target.value);
                                }
                              }}
                            >
                              <option value="">Select Driver</option>
                              {getAvailableDrivers().map(driver => (
                                <option key={driver._id} value={driver._id}>
                                  {driver.name}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn"
                              onClick={() => setAssigningDriver(null)}
                              style={{ padding: '2px 8px', fontSize: '10px', backgroundColor: '#6c757d', color: 'white' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => setAssigningDriver(booking._id)}
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Assign Driver
                          </button>
                        )}
                      </div>
                    )}
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

export default AdminBookings;