import React, { useState, useEffect } from 'react';
import { bookingsAPI, driversAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningDriver, setAssigningDriver] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bRes, dRes] = await Promise.all([bookingsAPI.getAllBookings(), driversAPI.getAllDrivers()]);
      setBookings(bRes.data);
      setDrivers(dRes.data);
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const assignDriver = async (bookingId, driverId) => {
    try {
      await bookingsAPI.assignDriver(bookingId, driverId);
      toast.success('Driver assigned successfully');
      fetchData();
      setAssigningDriver(null);
    } catch { toast.error('Failed to assign driver'); }
  };

  const availableDrivers = drivers.filter(d => d.isAvailable && d.isActive);

  const statusIcon = (s) => ({ pending: 'fa-clock', assigned: 'fa-user-check', started: 'fa-play-circle', 'in-progress': 'fa-route', completed: 'fa-check-circle', cancelled: 'fa-times-circle' }[s] || 'fa-circle');

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const pending = bookings.filter(b => b.status === 'pending');
  const active = bookings.filter(b => ['assigned', 'started', 'in-progress'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');
  const totalRevenue = completed.reduce((s, b) => s + (b.totalAmount || 0), 0);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !search || b._id?.includes(search) || b.customerId?.name?.toLowerCase().includes(q) || b.customerId?.phone?.includes(search) || b.driverId?.name?.toLowerCase().includes(q) || b.carId?.name?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || b.status === filter || (filter === 'active' && ['assigned', 'started', 'in-progress'].includes(b.status));
    return matchSearch && matchFilter;
  }).sort((a, b) => new Date(b.pickupDateTime) - new Date(a.pickupDateTime));

  if (loading) {
    return (<div className="ab-loading"><i className="fas fa-spinner fa-spin"></i><span>Loading bookings…</span></div>);
  }

  return (
    <div className="ab-page">
      {/* Header */}
      <div className="ab-header">
        <h1><i className="fas fa-calendar-check"></i> All Bookings</h1>
        <div className="ab-header-meta">
          <i className="fas fa-clock"></i>
          Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats */}
      <div className="ab-stats">
        <div className="ab-stat-card">
          <div className="ab-stat-icon purple"><i className="fas fa-layer-group"></i></div>
          <div className="ab-stat-info"><h4>{bookings.length}</h4><span>Total Bookings</span></div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-icon amber"><i className="fas fa-clock"></i></div>
          <div className="ab-stat-info"><h4>{pending.length}</h4><span>Pending</span></div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-icon blue"><i className="fas fa-car-side"></i></div>
          <div className="ab-stat-info"><h4>{active.length}</h4><span>Active</span></div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-icon green"><i className="fas fa-flag-checkered"></i></div>
          <div className="ab-stat-info"><h4>{completed.length}</h4><span>Completed</span></div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-icon teal"><i className="fas fa-wallet"></i></div>
          <div className="ab-stat-info"><h4>₹{totalRevenue.toLocaleString('en-IN')}</h4><span>Revenue</span></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ab-toolbar">
        <div className="ab-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search by customer, driver, car or booking ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[
          { key: 'all', icon: 'fa-th', label: 'All' },
          { key: 'pending', icon: 'fa-clock', label: 'Pending' },
          { key: 'active', icon: 'fa-car-side', label: 'Active' },
          { key: 'completed', icon: 'fa-check-circle', label: 'Completed' },
        ].map(f => (
          <button key={f.key} className={`ab-filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            <i className={`fas ${f.icon}`} style={{ fontSize: '0.7rem' }}></i> {f.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="ab-section">
        <div className="ab-section-header">
          <h3><i className="fas fa-list-alt"></i> Bookings</h3>
          <span className="ab-section-count">{filtered.length} of {bookings.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ab-empty">
            <i className="fas fa-inbox"></i>
            <p>{bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your search.'}</p>
          </div>
        ) : (
          <div className="ab-bookings-list">
            {filtered.map(booking => (
              <div key={booking._id} className="ab-booking-card">
                {/* Top Row */}
                <div className="ab-booking-top">
                  <div className="ab-booking-id-group">
                    <div className={`ab-booking-icon ${booking.status}`}>
                      <i className={`fas ${statusIcon(booking.status)}`}></i>
                    </div>
                    <div>
                      <div className="ab-booking-id">#{booking._id.slice(-6)}</div>
                      <div className="ab-booking-date">
                        {new Date(booking.pickupDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Date(booking.pickupDateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="ab-booking-right">
                    <div className="ab-amount">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</div>
                    <span className={`ab-status ${booking.status}`}>{booking.status}</span>
                  </div>
                </div>

                {/* Body Grid */}
                <div className="ab-booking-body">
                  {/* Customer */}
                  <div className="ab-info-block">
                    <h5>Customer</h5>
                    <div className="ab-info-row">
                      <i className="fas fa-user"></i>
                      <div>
                        <strong>{booking.customerId?.name || 'N/A'}</strong>
                        <div className="ab-sub">{booking.customerId?.phone || ''}</div>
                      </div>
                    </div>
                  </div>

                  {/* Car */}
                  <div className="ab-info-block">
                    <h5>Vehicle</h5>
                    <div className="ab-info-row">
                      <i className="fas fa-car"></i>
                      <div>
                        <strong>{booking.carId?.name || 'N/A'}</strong>
                        <div className="ab-sub">{booking.carId?.number || ''}</div>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="ab-info-block">
                    <h5>Route</h5>
                    <div className="ab-route">
                      <div className="ab-route-point">
                        <span className="ab-route-dot pickup"></span>
                        <span>{booking.pickupLocation?.address || 'N/A'}</span>
                      </div>
                      <div className="ab-route-line"></div>
                      {booking.placesToVisit && booking.placesToVisit.length > 0 && (
                        <div className="ab-via">
                          <i className="fas fa-map-pin" style={{ marginRight: '0.3rem' }}></i>
                          via {booking.placesToVisit.length} stop{booking.placesToVisit.length > 1 ? 's' : ''}
                          {' — '}
                          {booking.placesToVisit.slice(0, 2).map(p => p.address).join(', ')}
                          {booking.placesToVisit.length > 2 && ` +${booking.placesToVisit.length - 2} more`}
                        </div>
                      )}
                      <div className="ab-route-point">
                        <span className="ab-route-dot drop"></span>
                        <span>{booking.dropLocation?.address || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="ab-distance-tag">
                      <i className="fas fa-road"></i> {booking.totalDistance || 0} km
                    </div>
                  </div>
                </div>

                {/* Footer: Driver + Assign */}
                <div className="ab-booking-footer">
                  <div>
                    {booking.driverId ? (
                      <div className="ab-driver-tag">
                        <div className="ab-driver-avatar">{getInitials(booking.driverId.name)}</div>
                        <div>
                          <strong>{booking.driverId.name}</strong>
                          <span className="ab-sub" style={{ marginLeft: '0.5rem' }}>{booking.driverId.phone}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="ab-no-driver"><i className="fas fa-user-slash" style={{ marginRight: '0.4rem' }}></i>No driver assigned</span>
                    )}
                  </div>

                  {booking.status === 'pending' && !booking.driverId && (
                    <div className="ab-assign-area">
                      {assigningDriver === booking._id ? (
                        <>
                          <select className="ab-assign-select" onChange={e => { if (e.target.value) assignDriver(booking._id, e.target.value); }}>
                            <option value="">Select driver…</option>
                            {availableDrivers.map(d => (
                              <option key={d._id} value={d._id}>{d.name} — {d.location?.address || 'No location'}</option>
                            ))}
                          </select>
                          <button className="ab-assign-btn cancel" onClick={() => setAssigningDriver(null)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <button className="ab-assign-btn primary" onClick={() => setAssigningDriver(booking._id)}>
                          <i className="fas fa-user-plus"></i> Assign Driver
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
