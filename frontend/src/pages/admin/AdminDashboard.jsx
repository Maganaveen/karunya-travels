import React, { useState, useEffect } from 'react';
import { adminAPI, bookingsAPI, carsAPI, driversAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, carsRes, driversRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        bookingsAPI.getAllBookings(),
        carsAPI.getAllAdmin(),
        driversAPI.getAllDrivers()
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data || []);
      setCars(carsRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
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
    return <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>{status.toUpperCase()}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: 'status-pending',
      completed: 'status-completed',
      failed: 'status-pending'
    };
    return <span className={`status-badge ${statusMap[status] || 'status-pending'}`}>{status.toUpperCase()}</span>;
  };

  const getActiveBookings = () => bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const getCompletedBookings = () => bookings.filter(b => b.status === 'completed');
  const getTotalRevenue = () => getCompletedBookings().reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
      <p>Loading dashboard...</p>
    </div>;
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Bookings Overview</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-bar"></i> Overview
            </button>
            <button 
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-check"></i> Recent Bookings
            </button>
            <button 
              className={`btn ${activeTab === 'cars' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('cars')}
            >
              <i className="fas fa-car"></i> Cars in Rent
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
              <div className="card">
                <h4>Total Booking Cap</h4>
                <h2 style={{ fontSize: '2.5rem', color: '#3b82f6', marginBottom: '0.5rem' }}>₹{getTotalRevenue().toLocaleString()}</h2>
                <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Completed Bookings</p>
                <span className="status-badge status-completed">{getCompletedBookings().length}</span>
              </div>

              <div className="card">
                <h4>Chome Drivs</h4>
                <h2 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '0.5rem' }}>{drivers.length}</h2>
                <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Active Drivers</p>
                <span className="status-badge status-assigned">{getActiveBookings().length}</span>
              </div>

              <div className="card">
                <h4>Revenue Tows</h4>
                <h2 style={{ fontSize: '2.5rem', color: '#f59e0b', marginBottom: '0.5rem' }}>₹{(getTotalRevenue() / 12).toLocaleString()}</h2>
                <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Monthly Average</p>
                <button className="btn btn-primary btn-sm">Estimate →</button>
              </div>
            </div>

            <div className="card">
              <div style={{ marginBottom: '1rem' }}>
                <h3>Statistics</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className={`btn ${true ? 'btn-primary' : 'btn-secondary'}`}>Renter</button>
                  <button className="btn btn-secondary">Driver</button>
                  <button className="btn btn-secondary">Driver</button>
                </div>
              </div>
              <div className="grid grid-4">
                <div style={{ padding: '1rem', borderRight: '1px solid var(--gray-200)' }}>
                  <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Bookings</p>
                  <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{bookings.length}</h2>
                  <small style={{ color: '#9ca3af' }}>All time</small>
                </div>
                <div style={{ padding: '1rem', borderRight: '1px solid var(--gray-200)' }}>
                  <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Active Now</p>
                  <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>{getActiveBookings().length}</h2>
                  <small style={{ color: '#9ca3af' }}>In progress</small>
                </div>
                <div style={{ padding: '1rem', borderRight: '1px solid var(--gray-200)' }}>
                  <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Completed</p>
                  <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{getCompletedBookings().length}</h2>
                  <small style={{ color: '#9ca3af' }}>Finished</small>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Cars</p>
                  <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{cars.length}</h2>
                  <small style={{ color: '#9ca3af' }}>Fleet</small>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Bookings</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Driver</th>
                    <th>Booking ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking.userId?._id?.slice(-6) || 'N/A'}</td>
                      <td>
                        <strong>{booking.userId?.name || 'Unknown'}</strong><br />
                        <small style={{ color: '#6c757d' }}>{booking.userId?.email}</small>
                      </td>
                      <td>
                        {booking.driverId ? (
                          <>
                            <strong>{booking.driverId.name}</strong><br />
                            <small style={{ color: '#6c757d' }}>{booking.driverId.phone}</small>
                          </>
                        ) : (
                          <span style={{ color: '#6c757d' }}>Not Assigned</span>
                        )}
                      </td>
                      <td>#{booking._id?.slice(-6)}</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>{getPaymentStatusBadge(booking.paymentStatus || 'pending')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Cars in Rent</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Car ID</th>
                    <th>Car Name & Number</th>
                    <th>Driver Assigned</th>
                    <th>Current Booking</th>
                    <th>Customer</th>
                    <th>Pickup Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status)).map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking.carId?._id?.slice(-6) || 'N/A'}</td>
                      <td>
                        <strong>{booking.carId?.name || 'Unknown'}</strong><br />
                        <small style={{ color: '#6c757d' }}>{booking.carId?.number}</small>
                      </td>
                      <td>
                        {booking.driverId ? (
                          <>
                            <strong>{booking.driverId.name}</strong><br />
                            <small style={{ color: '#6c757d' }}>{booking.driverId.phone}</small>
                          </>
                        ) : (
                          <span style={{ color: '#6c757d' }}>Not Assigned</span>
                        )}
                      </td>
                      <td>#{booking._id?.slice(-6)}</td>
                      <td>
                        <strong>{booking.userId?.name || 'Unknown'}</strong><br />
                        <small style={{ color: '#6c757d' }}>{booking.userId?.phone}</small>
                      </td>
                      <td>
                        {new Date(booking.pickupDateTime).toLocaleDateString()}<br />
                        <small style={{ color: '#6c757d' }}>{new Date(booking.pickupDateTime).toLocaleTimeString()}</small>
                      </td>
                      <td>{getStatusBadge(booking.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status)).length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                  <p>No cars currently rented</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;