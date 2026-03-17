import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { adminAPI, authAPI, driversAPI, carsAPI, bookingsAPI } from '../../services/api';
import './AdminDrivers.css';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchDrivers();
    fetchCars();
    fetchPendingBookings();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAllAdmin();
      setCars(response.data.filter(car => car.status === 'available'));
    } catch (error) {
      console.error('Failed to fetch cars');
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const response = await bookingsAPI.getAllBookings();
      setBookings(response.data.filter(booking => booking.status === 'pending'));
    } catch (error) {
      console.error('Failed to fetch bookings');
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await driversAPI.getAllDrivers();
      setDrivers(response.data);
    } catch (error) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await authAPI.register({ ...data, role: 'driver' });
      toast.success('Driver account created successfully');
      fetchDrivers();
      setShowForm(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create driver account');
    }
  };

  const toggleDriverStatus = async (driverId) => {
    try {
      await adminAPI.toggleUserStatus(driverId);
      toast.success('Driver status updated');
      fetchDrivers();
    } catch (error) {
      toast.error('Failed to update driver status');
    }
  };

  const allocateCar = async (driverId, carId) => {
    try {
      await carsAPI.update(carId, { assignedDriver: driverId, status: 'assigned' });
      toast.success('Car allocated successfully');
      setShowCarModal(false);
      fetchDrivers();
      fetchCars();
    } catch (error) {
      toast.error('Failed to allocate car');
    }
  };

  const openCarModal = (driver) => {
    setSelectedDriver(driver);
    setShowCarModal(true);
  };

  const openTripModal = (driver) => {
    if (!driver.isAvailable) {
      toast.error('Driver must be online to allocate trips');
      return;
    }
    setSelectedDriver(driver);
    setShowTripModal(true);
  };

  const allocateTrip = async (driverId, bookingId) => {
    try {
      await bookingsAPI.assignDriver(bookingId, driverId);
      toast.success('Trip allocated successfully');
      setShowTripModal(false);
      fetchPendingBookings();
    } catch (error) {
      toast.error('Failed to allocate trip');
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h ago`;
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const filtered = drivers.filter(d => {
    const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase()) || d.phone?.includes(search);
    const matchFilter = filter === 'all' || (filter === 'online' && d.isAvailable) || (filter === 'offline' && !d.isAvailable) || (filter === 'active' && d.isActive) || (filter === 'inactive' && !d.isActive);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="ad-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading drivers…</span>
      </div>
    );
  }

  return (
    <div className="ad-page">
      {/* ── Header ── */}
      <div className="ad-header">
        <h1><i className="fas fa-id-card"></i> Manage Drivers</h1>
        <div className="ad-header-actions">
          <button className="ad-btn-add" onClick={() => { setShowForm(!showForm); if (showForm) reset(); }}>
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? 'Cancel' : 'Add Driver'}
          </button>
        </div>
      </div>

      {/* ── Create Form ── */}
      {showForm && (
        <div className="ad-form-card">
          <h3><i className="fas fa-user-plus"></i> Create Driver Account</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="ad-form-grid">
              <div className="form-group">
                <label>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="form-control" placeholder="Enter full name" {...register('name', { required: 'Name is required' })} style={{ borderColor: errors.name ? '#ef4444' : undefined }} />
                {errors.name && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="email" className="form-control" placeholder="driver@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })} style={{ borderColor: errors.email ? '#ef4444' : undefined }} />
                {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="tel" className="form-control" placeholder="+91 98765 43210" {...register('phone', { required: 'Phone is required' })} style={{ borderColor: errors.phone ? '#ef4444' : undefined }} />
                {errors.phone && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.phone.message}</span>}
              </div>
              <div className="form-group">
                <label>License Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="form-control" placeholder="DL12345678" {...register('licenseNumber', { required: 'License number is required' })} style={{ borderColor: errors.licenseNumber ? '#ef4444' : undefined }} />
                {errors.licenseNumber && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.licenseNumber.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="password" className="form-control" placeholder="Min 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} style={{ borderColor: errors.password ? '#ef4444' : undefined }} />
              {errors.password && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.password.message}</span>}
            </div>
            <div className="ad-form-actions">
              <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Create Account</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); reset(); }}><i className="fas fa-times"></i> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="ad-stats">
        <div className="ad-stat-card">
          <div className="ad-stat-icon blue"><i className="fas fa-users"></i></div>
          <div className="ad-stat-info">
            <h4>{drivers.length}</h4>
            <span>Total Drivers</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon green"><i className="fas fa-user-check"></i></div>
          <div className="ad-stat-info">
            <h4>{drivers.filter(d => d.isActive).length}</h4>
            <span>Active</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon indigo"><i className="fas fa-signal"></i></div>
          <div className="ad-stat-info">
            <h4>{drivers.filter(d => d.isAvailable).length}</h4>
            <span>Online Now</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon red"><i className="fas fa-user-slash"></i></div>
          <div className="ad-stat-info">
            <h4>{drivers.filter(d => !d.isActive).length}</h4>
            <span>Inactive</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="ad-toolbar">
        <div className="ad-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search by name, email or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'online', 'offline', 'active', 'inactive'].map(f => (
          <button key={f} className={`ad-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' && <><i className="fas fa-th"></i> All</>}
            {f === 'online' && <><i className="fas fa-circle" style={{ fontSize: '0.5rem', color: '#10b981' }}></i> Online</>}
            {f === 'offline' && <><i className="fas fa-circle" style={{ fontSize: '0.5rem', color: '#ef4444' }}></i> Offline</>}
            {f === 'active' && <><i className="fas fa-check-circle" style={{ fontSize: '0.7rem' }}></i> Active</>}
            {f === 'inactive' && <><i className="fas fa-times-circle" style={{ fontSize: '0.7rem' }}></i> Inactive</>}
          </button>
        ))}
      </div>

      {/* ── Drivers Grid ── */}
      <div className="ad-section">
        <div className="ad-section-header">
          <h3><i className="fas fa-list"></i> Drivers Directory</h3>
          <span className="ad-section-count">{filtered.length} of {drivers.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ad-empty">
            <i className="fas fa-users-slash"></i>
            <p>{drivers.length === 0 ? 'No drivers yet.' : 'No drivers match your search.'}</p>
            <small>{drivers.length === 0 ? 'Create your first driver account to get started.' : 'Try adjusting your filters.'}</small>
          </div>
        ) : (
          <div className="ad-drivers-grid">
            {filtered.map(driver => (
              <div key={driver._id} className="ad-driver-card">
                {/* Top: Avatar + Name + Badges */}
                <div className="ad-driver-top">
                  <div className="ad-driver-avatar">{getInitials(driver.name)}</div>
                  <div className="ad-driver-info">
                    <div className="ad-driver-name">{driver.name}</div>
                    <div className="ad-driver-id">ID: {driver._id.slice(-8)}</div>
                  </div>
                  <div className="ad-driver-badges">
                    <span className={`ad-badge ${driver.isActive ? 'active' : 'inactive'}`}>
                      <i className={`fas ${driver.isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {driver.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`ad-badge ${driver.isAvailable ? 'online' : 'offline'}`}>
                      <i className="fas fa-circle"></i>
                      {driver.isAvailable ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="ad-driver-details">
                  <div className="ad-detail"><i className="fas fa-envelope"></i><span>{driver.email}</span></div>
                  <div className="ad-detail"><i className="fas fa-phone"></i><span>{driver.phone}</span></div>
                  <div className="ad-detail"><i className="fas fa-id-badge"></i><span className="ad-license">{driver.licenseNumber}</span></div>
                  <div className="ad-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{driver.location?.address || 'No location set'}</span>
                  </div>
                  <div className="ad-detail"><i className="fas fa-calendar"></i><span>Joined {new Date(driver.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                </div>

                {/* Offline Reason */}
                {!driver.isAvailable && (
                  <div className="ad-offline-info">
                    <div className="ad-offline-icon"><i className="fas fa-moon"></i></div>
                    <div className="ad-offline-text">
                      <div className="ad-offline-reason">
                        {driver.location?.offlineReason || 'No reason provided'}
                      </div>
                      {driver.location?.updatedAt && (
                        <div className="ad-offline-time">
                          <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
                          Offline since {getTimeAgo(driver.location.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="ad-driver-actions">
                  <button className={`ad-action-btn ${driver.isActive ? 'toggle-active' : 'toggle-inactive'}`} onClick={() => toggleDriverStatus(driver._id)}>
                    <i className={`fas ${driver.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                    {driver.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button className="ad-action-btn car" onClick={() => openCarModal(driver)} disabled={!driver.isAvailable}>
                    <i className="fas fa-car"></i> Assign Car
                  </button>
                  <button className="ad-action-btn trip" onClick={() => openTripModal(driver)} disabled={!driver.isAvailable}>
                    <i className="fas fa-route"></i> Assign Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Trip Allocation Modal ── */}
      {showTripModal && (
        <div className="ad-modal-overlay" onClick={() => setShowTripModal(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h3>Assign Trip to {selectedDriver?.name}</h3>
              <button className="ad-modal-close" onClick={() => setShowTripModal(false)}>×</button>
            </div>
            <div className="ad-modal-body">
              {bookings.length === 0 ? (
                <div className="ad-empty" style={{ padding: '2rem' }}>
                  <i className="fas fa-inbox"></i>
                  <p>No pending bookings to assign.</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="ad-modal-item">
                    <div className="ad-modal-item-info">
                      <h4>{booking.customerId?.name || 'N/A'}</h4>
                      <p>
                        <i className="fas fa-map-marker-alt" style={{ color: '#10b981', marginRight: '0.3rem' }}></i>
                        {booking.pickupLocation?.address || booking.pickupLocation || 'N/A'}
                        <span style={{ margin: '0 0.3rem', color: '#cbd5e1' }}>→</span>
                        {booking.dropLocation?.address || booking.dropLocation || 'N/A'}
                      </p>
                      <p>₹{booking.totalAmount} · {new Date(booking.pickupDateTime || booking.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => allocateTrip(selectedDriver._id, booking._id)}>Assign</button>
                  </div>
                ))
              )}
            </div>
            <div className="ad-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowTripModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Car Allocation Modal ── */}
      {showCarModal && (
        <div className="ad-modal-overlay" onClick={() => setShowCarModal(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h3>Assign Car to {selectedDriver?.name}</h3>
              <button className="ad-modal-close" onClick={() => setShowCarModal(false)}>×</button>
            </div>
            <div className="ad-modal-body">
              {cars.length === 0 ? (
                <div className="ad-empty" style={{ padding: '2rem' }}>
                  <i className="fas fa-car"></i>
                  <p>No available cars to assign.</p>
                </div>
              ) : (
                cars.map(car => (
                  <div key={car._id} className="ad-modal-item">
                    <div className="ad-modal-item-info">
                      <h4>{car.name}</h4>
                      <p>{car.number} · {car.type}</p>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => allocateCar(selectedDriver._id, car._id)}>Assign</button>
                  </div>
                ))
              )}
            </div>
            <div className="ad-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCarModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;
a