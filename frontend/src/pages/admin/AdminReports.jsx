import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getBookingReports(selectedPeriod);
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Reports & Analytics</h2>
        <div>
          <label style={{ marginRight: '10px' }}>Period:</label>
          <select
            className="form-control"
            style={{ width: 'auto', display: 'inline-block' }}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {reports && (
        <>
          <div className="grid grid-4" style={{ marginBottom: '30px' }}>
            <div className="card">
              <h3>Total Bookings</h3>
              <h2 style={{ color: '#007bff' }}>{reports.totalBookings}</h2>
              <p>{selectedPeriod === 'daily' ? 'Today' : 'This Month'}</p>
            </div>
            <div className="card">
              <h3>Completed Trips</h3>
              <h2 style={{ color: '#28a745' }}>{reports.completedBookings}</h2>
              <p>Success Rate: {reports.totalBookings > 0 ? Math.round((reports.completedBookings / reports.totalBookings) * 100) : 0}%</p>
            </div>
            <div className="card">
              <h3>Total Amount</h3>
              <h2 style={{ color: '#ffc107' }}>₹{reports.totalAmount}</h2>
              <p>Gross Revenue</p>
            </div>
            <div className="card">
              <h3>Net Revenue</h3>
              <h2 style={{ color: '#dc3545' }}>₹{reports.revenue}</h2>
              <p>From Completed Trips</p>
            </div>
          </div>

          <div className="card">
            <h3>{selectedPeriod === 'daily' ? 'Today\'s' : 'This Month\'s'} Bookings</h3>
            {reports.bookings.length === 0 ? (
              <p>No bookings found for the selected period.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Driver</th>
                    <th>Car</th>
                    <th>Route</th>
                    <th>Distance</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking._id.slice(-6)}</td>
                      <td>
                        <div>
                          <strong>{booking.customerId?.name}</strong><br />
                          <small>{booking.customerId?.email}</small>
                        </div>
                      </td>
                      <td>
                        {booking.driverId ? (
                          <div>
                            <strong>{booking.driverId.name}</strong><br />
                            <small>{booking.driverId.email}</small>
                          </div>
                        ) : (
                          <span style={{ color: '#6c757d' }}>Not Assigned</span>
                        )}
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
                          <strong>To:</strong> {booking.dropLocation.address}
                          {booking.placesToVisit.length > 0 && (
                            <>
                              <br /><strong>Via:</strong> {booking.placesToVisit.map(p => p.address).join(', ')}
                            </>
                          )}
                        </div>
                      </td>
                      <td>{booking.totalDistance} km</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        {new Date(booking.createdAt).toLocaleDateString()}<br />
                        <small>{new Date(booking.createdAt).toLocaleTimeString()}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="grid grid-2" style={{ marginTop: '30px' }}>
            <div className="card">
              <h3>Revenue Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gross Revenue:</span>
                  <strong>₹{reports.totalAmount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completed Trips Revenue:</span>
                  <strong>₹{reports.revenue}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pending Revenue:</span>
                  <strong>₹{reports.totalAmount - reports.revenue}</strong>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Average Trip Value:</span>
                  <strong>₹{reports.totalBookings > 0 ? Math.round(reports.totalAmount / reports.totalBookings) : 0}</strong>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Performance Metrics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completion Rate:</span>
                  <strong>{reports.totalBookings > 0 ? Math.round((reports.completedBookings / reports.totalBookings) * 100) : 0}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Bookings:</span>
                  <strong>{reports.totalBookings}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completed Trips:</span>
                  <strong>{reports.completedBookings}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pending Trips:</span>
                  <strong>{reports.totalBookings - reports.completedBookings}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;