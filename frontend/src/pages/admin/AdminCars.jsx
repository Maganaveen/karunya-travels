import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { carsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminCars.css';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAllAdmin();
      setCars(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'image') {
          if (data.image?.[0]) formData.append('image', data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      if (editingCar) {
        await carsAPI.update(editingCar._id, formData);
        toast.success('Car updated successfully');
      } else {
        await carsAPI.create(formData);
        toast.success('Car added successfully');
      }
      fetchCars();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    reset(car);
    setShowForm(true);
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await carsAPI.delete(carId);
      toast.success('Car deleted successfully');
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete car');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCar(null);
    setImagePreview(null);
    reset();
  };

  const filtered = cars.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.number?.toLowerCase().includes(search.toLowerCase()) || c.model?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'available' && c.isAvailable) || (filter === 'unavailable' && !c.isAvailable);
    return matchSearch && matchFilter;
  });

  const fuelIcon = (type) => {
    const icons = { petrol: 'fa-gas-pump', diesel: 'fa-oil-can', electric: 'fa-bolt', hybrid: 'fa-leaf' };
    return icons[type] || 'fa-gas-pump';
  };

  if (loading) {
    return (
      <div className="ad-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading cars…</span>
      </div>
    );
  }

  return (
    <div className="ad-page">
      {/* ── Header ── */}
      <div className="ad-header">
        <h1><i className="fas fa-car"></i> Manage Cars</h1>
        <div className="ad-header-actions">
          <button className="ad-btn-add" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? 'Cancel' : 'Add Car'}
          </button>
        </div>
      </div>

      {/* ── Add/Edit Form ── */}
      {showForm && (
        <div className="ad-form-card">
          <h3><i className={`fas ${editingCar ? 'fa-pen' : 'fa-plus-circle'}`}></i> {editingCar ? 'Edit Car' : 'Add New Car'}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="ad-form-grid">
              <div className="form-group">
                <label>Car Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="form-control" placeholder="e.g. Swift Dzire" {...register('name', { required: 'Car name is required' })} style={{ borderColor: errors.name ? '#ef4444' : undefined }} />
                {errors.name && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label>Car Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="form-control" placeholder="e.g. TN 01 AB 1234" {...register('number', { required: 'Car number is required' })} style={{ borderColor: errors.number ? '#ef4444' : undefined }} />
                {errors.number && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.number.message}</span>}
              </div>
              <div className="form-group">
                <label>Model <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="form-control" placeholder="e.g. 2024" {...register('model', { required: 'Model is required' })} style={{ borderColor: errors.model ? '#ef4444' : undefined }} />
                {errors.model && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.model.message}</span>}
              </div>
              <div className="form-group">
                <label>Price per KM (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="number" step="0.01" className="form-control" placeholder="e.g. 12.50" {...register('pricePerKm', { required: 'Price per KM is required', min: 0 })} style={{ borderColor: errors.pricePerKm ? '#ef4444' : undefined }} />
                {errors.pricePerKm && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.pricePerKm.message}</span>}
              </div>
              <div className="form-group">
                <label>Capacity <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="number" className="form-control" placeholder="e.g. 4" {...register('capacity', { required: 'Capacity is required', min: 1 })} style={{ borderColor: errors.capacity ? '#ef4444' : undefined }} />
                {errors.capacity && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.capacity.message}</span>}
              </div>
              <div className="form-group">
                <label>Fuel Type <span style={{ color: '#ef4444' }}>*</span></label>
                <select className="form-control" {...register('fuelType', { required: 'Fuel type is required' })} style={{ borderColor: errors.fuelType ? '#ef4444' : undefined }}>
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.fuelType && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.fuelType.message}</span>}
              </div>
              <div className="form-group">
                <label>Category <span style={{ color: '#ef4444' }}>*</span></label>
                <select className="form-control" {...register('category', { required: 'Category is required' })} style={{ borderColor: errors.category ? '#ef4444' : undefined }}>
                  <option value="">Select Category</option>
                  <option value="Small Car">Small Car</option>
                  <option value="SUV / MUV">SUV / MUV</option>
                </select>
                {errors.category && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.category.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Image (Optional)</label>
              <input type="file" className="form-control" accept="image/*" {...register('image', {
                validate: (files) => {
                  if (files?.[0] && files[0].size > 10 * 1024 * 1024) return 'Image must be less than 10MB';
                  return true;
                }
              })} onChange={e => {
                const file = e.target.files[0];
                if (file && file.size > 10 * 1024 * 1024) {
                  toast.error('Image must be less than 10MB');
                  e.target.value = '';
                  setImagePreview(null);
                  return;
                }
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }} />
              {errors.image && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.image.message}</span>}
              {(imagePreview || editingCar?.image) && <img src={imagePreview || editingCar?.image} alt="Preview" style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '8px' }} />}
            </div>
            <div className="ad-form-actions">
              <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> {editingCar ? 'Update Car' : 'Add Car'}</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}><i className="fas fa-times"></i> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="ad-stats">
        <div className="ad-stat-card">
          <div className="ad-stat-icon blue"><i className="fas fa-car"></i></div>
          <div className="ad-stat-info">
            <h4>{cars.length}</h4>
            <span>Total Cars</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon green"><i className="fas fa-check-circle"></i></div>
          <div className="ad-stat-info">
            <h4>{cars.filter(c => c.isAvailable).length}</h4>
            <span>Available</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon orange"><i className="fas fa-ban"></i></div>
          <div className="ad-stat-info">
            <h4>{cars.filter(c => !c.isAvailable).length}</h4>
            <span>Unavailable</span>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon purple"><i className="fas fa-tags"></i></div>
          <div className="ad-stat-info">
            <h4>₹{cars.length ? (cars.reduce((s, c) => s + (Number(c.pricePerKm) || 0), 0) / cars.length).toFixed(1) : 0}</h4>
            <span>Avg Price/KM</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="ad-toolbar">
        <div className="ad-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search by name, number or model…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'available', 'unavailable'].map(f => (
          <button key={f} className={`ad-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' && <><i className="fas fa-th"></i> All</>}
            {f === 'available' && <><i className="fas fa-circle" style={{ fontSize: '0.5rem', color: '#10b981' }}></i> Available</>}
            {f === 'unavailable' && <><i className="fas fa-circle" style={{ fontSize: '0.5rem', color: '#ef4444' }}></i> Unavailable</>}
          </button>
        ))}
      </div>

      {/* ── Cars Grid ── */}
      <div className="ad-section">
        <div className="ad-section-header">
          <h3><i className="fas fa-list"></i> Fleet Directory</h3>
          <span className="ad-section-count">{filtered.length} of {cars.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ad-empty">
            <i className="fas fa-car-side"></i>
            <p>{cars.length === 0 ? 'No cars yet.' : 'No cars match your search.'}</p>
            <small>{cars.length === 0 ? 'Add your first car to get started.' : 'Try adjusting your filters.'}</small>
          </div>
        ) : (
          <div className="ad-cars-grid">
            {filtered.map(car => (
              <div key={car._id} className="ad-car-card">
                <div className="ad-car-top">
                  <div className="ad-car-icon">
                    {car.image ? <img src={car.image} alt={car.name} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<i class="fas fa-car"></i>'; }} /> : <i className="fas fa-car"></i>}
                  </div>
                  <div className="ad-car-info">
                    <div className="ad-car-name">{car.name}</div>
                    <span className="ad-car-number">{car.number}</span>
                  </div>
                  <div className="ad-car-badges">
                    <span className={`ad-badge ${car.isAvailable ? 'active' : 'inactive'}`}>
                      <i className={`fas ${car.isAvailable ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="ad-car-details">
                  <div className="ad-car-detail"><i className="fas fa-cog"></i><span>{car.model}</span></div>
                  <div className="ad-car-detail"><i className="fas fa-users"></i><span>{car.capacity} seats</span></div>
                  <div className="ad-car-detail"><i className={`fas ${fuelIcon(car.fuelType)}`}></i><span style={{ textTransform: 'capitalize' }}>{car.fuelType}</span></div>
                  <div className="ad-car-detail"><i className="fas fa-rupee-sign"></i><span className="ad-price">₹{car.pricePerKm}/km</span></div>
                </div>

                <div className="ad-car-actions">
                  <button className="ad-action-btn edit" onClick={() => handleEdit(car)}>
                    <i className="fas fa-pen"></i> Edit
                  </button>
                  <button className="ad-action-btn delete" onClick={() => handleDelete(car._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
a