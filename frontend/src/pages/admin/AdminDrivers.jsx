import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI, authAPI, driversAPI, carsAPI, bookingsAPI } from '../../services/api';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
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
      console.log('Drivers data:', response.data); // Debug log
      setDrivers(response.data);
    } catch (error) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting driver registration data:', { ...data, role: 'driver' });
      const response = await authAPI.register({ ...data, role: 'driver' });
      console.log('Registration response:', response);
      toast.success('Driver account created successfully');
      fetchDrivers();
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create driver account';
      toast.error(errorMessage);
    }
  };

  const toggleDriverStatus = async (driverId) => {
    try {
      await adminAPI.toggleUserStatus(driverId);
      toast.success('Driver status updated successfully');
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

  const getStatusBadge = (isActive) => {
    console.log('isActive:', isActive);
    return (
      <span className={`status-badge ${isActive ? 'status-completed' : 'status-pending'}`}>
        <i className={`fas ${isActive ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    );
  };

  const getAvailabilityBadge = (isAvailable) => {
    console.log('isAvailable:', isAvailable);
    return (
      <span className={`status-badge ${isAvailable ? 'status-completed' : 'status-pending'}`}>
        <i className={`fas fa-circle`}></i> {isAvailable ? 'ONLINE' : 'OFFLINE'}
      </span>
    );
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2><i className="fas fa-id-card"></i> Manage Drivers</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'Add New Driver'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}><i className="fas fa-user-plus"></i> Create Driver Account</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter driver's full name"
                  {...register('name', { required: 'Name is required' })}
                  style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}><i className="fas fa-exclamation-circle"></i> {errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="driver@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                  })}
                  style={{ borderColor: errors.email ? '#ef4444' : undefined }}
                />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}><i className="fas fa-exclamation-circle"></i> {errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (234) 567-8900"
                  {...register('phone', { required: 'Phone is required' })}
                  style={{ borderColor: errors.phone ? '#ef4444' : undefined }}
                />
                {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}><i className="fas fa-exclamation-circle"></i> {errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label>License Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="DL12345678"
                  {...register('licenseNumber', { required: 'License number is required' })}
                  style={{ borderColor: errors.licenseNumber ? '#ef4444' : undefined }}
                />
                {errors.licenseNumber && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}><i className="fas fa-exclamation-circle"></i> {errors.licenseNumber.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter a secure password (min 6 characters)"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                style={{ borderColor: errors.password ? '#ef4444' : undefined }}
              />
              {errors.password && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem', display: 'block' }}><i className="fas fa-exclamation-circle"></i> {errors.password.message}</span>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> Create Driver Account
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); reset(); }}>
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Total Drivers</h4>
          <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>{drivers.length}</h2>
          <small style={{ color: '#9ca3af' }}>All drivers</small>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Active</h4>
          <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>
            {drivers.filter(d => d.isActive).length}
          </h2>
          <small style={{ color: '#9ca3af' }}>Currently active</small>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Online</h4>
          <h2 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>
            {drivers.filter(d => d.isAvailable).length}
          </h2>
          <small style={{ color: '#9ca3af' }}>Currently online</small>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>Inactive</h4>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
            {drivers.filter(d => !d.isActive).length}
          </h2>
          <small style={{ color: '#9ca3af' }}>Deactivated</small>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}><i className="fas fa-list"></i> Drivers Directory</h3>
        </div>
        {drivers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-users" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>No drivers found. Create your first driver account!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Driver Info</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Contact Details</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>License Number</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Availability</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Joined</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Actions</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Allocate Car</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Allocate Trip</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id}>
                    <td style={{ minWidth: '150px', padding: '1rem', verticalAlign: 'top' }}>
                      <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '0.25rem' }}>{driver.name}</strong>
                      <small style={{ color: '#6c757d' }}>ID: {driver._id.slice(-8)}</small>
                    </td>
                    <td style={{ minWidth: '180px', padding: '1rem', verticalAlign: 'top' }}>
                      <div style={{ lineHeight: '1.6' }}>
                        <div><i className="fas fa-envelope" style={{ color: '#667eea', marginRight: '0.5rem', minWidth: '14px' }}></i>{driver.email}</div>
                        <div><i className="fas fa-phone" style={{ color: '#667eea', marginRight: '0.5rem', minWidth: '14px' }}></i>{driver.phone}</div>
                      </div>
                    </td>
                    <td style={{ minWidth: '140px', padding: '1rem', verticalAlign: 'top' }}>
                      <span style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {driver.licenseNumber}
                      </span>
                    </td>
                    <td style={{ minWidth: '180px', padding: '1rem', verticalAlign: 'top' }}>
                      {driver.location ? (
                        <div style={{ lineHeight: '1.4' }}>
                          <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                            {driver.location.address || 'Location set'}
                          </div>
                          <small style={{ color: '#6c757d' }}>
                            Updated: {new Date(driver.location.lastUpdated).toLocaleDateString()}
                          </small>
                        </div>
                      ) : (
                        <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                          <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
                          No location set
                        </span>
                      )}
                    </td>
                    <td style={{ minWidth: '100px', padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>                      
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: '500', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        backgroundColor: driver.isActive ? '#d1fae5' : '#fef3c7',
                        color: driver.isActive ? '#059669' : '#d97706',
                        display: 'inline-block'
                      }}>
                        <i className={`fas ${driver.isActive ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: '0.5rem' }}></i>
                        {driver.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ minWidth: '100px', padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: '500', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        backgroundColor: driver.isAvailable ? '#d1fae5' : '#fef3c7',
                        color: driver.isAvailable ? '#059669' : '#d97706',
                        display: 'inline-block'
                      }}>
                        <i className="fas fa-circle" style={{ marginRight: '0.5rem' }}></i>
                        {driver.isAvailable ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </td>
                    <td style={{ minWidth: '140px', padding: '1rem', verticalAlign: 'top' }}>
                      <div style={{ lineHeight: '1.6' }}>
                        <div>{new Date(driver.createdAt).toLocaleDateString()}</div>
                        <small style={{ color: '#6c757d' }}>{new Date(driver.createdAt).toLocaleTimeString()}</small>
                      </div>
                    </td>
                    <td style={{ minWidth: '120px', padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        className={`btn btn-sm ${driver.isActive ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                        onClick={() => toggleDriverStatus(driver._id)}
                      >
                        <i className={`fas ${driver.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                        {driver.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                    <td style={{ minWidth: '120px', padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        className={`btn btn-sm ${driver.isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => openCarModal(driver)}
                        disabled={!driver.isAvailable}
                      >
                        <i className="fas fa-car"></i>
                        Allocate Car
                      </button>
                    </td>
                    <td style={{ minWidth: '120px', padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        className={`btn btn-sm ${driver.isAvailable ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => openTripModal(driver)}
                        disabled={!driver.isAvailable}
                      >
                        <i className="fas fa-route"></i>
                        Allocate Trip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {drivers.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', textAlign: 'right', color: '#6c757d', fontSize: '0.9rem' }}>
            Total: {drivers.length} drivers
          </div>
        )}
      </div>

      {/* Trip Allocation Modal */}
      {showTripModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Allocate Trip to {selectedDriver?.name}</h3>
            {bookings.length === 0 ? (
              <p>No pending bookings to allocate.</p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {bookings.map(booking => (
                  <div key={booking._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <strong>Customer: {booking.customerId?.name || 'N/A'}</strong>
                          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Phone: {booking.customerId?.phone || 'N/A'}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <div><i className="fas fa-map-marker-alt" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                            From: {booking.pickupLocation}</div>
                          <div><i className="fas fa-map-marker-alt" style={{ color: '#ef4444', marginRight: '0.5rem' }}></i>
                            To: {booking.dropLocation}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          <div>Date: {new Date(booking.pickupDate).toLocaleDateString()}</div>
                          <div>Amount: ₹{booking.totalAmount}</div>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => allocateTrip(selectedDriver._id, booking._id)}
                      >
                        Allocate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowTripModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Car Allocation Modal */}
      {showCarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Allocate Car to {selectedDriver?.name}</h3>
            {cars.length === 0 ? (
              <p>No available cars to allocate.</p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cars.map(car => (
                  <div key={car._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{car.name}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>{car.number} • {car.type}</div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => allocateCar(selectedDriver._id, car._id)}
                    >
                      Allocate
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowCarModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;