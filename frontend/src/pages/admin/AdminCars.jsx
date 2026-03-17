import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { carsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAllAdmin();
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingCar) {
        await carsAPI.update(editingCar._id, data);
        toast.success('Car updated successfully');
      } else {
        await carsAPI.create(data);
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
      toast.error('Failed to delete car');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCar(null);
    reset();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Manage Cars</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Car'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Car Name</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('name', { required: 'Car name is required' })}
                />
                {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label>Car Number</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('number', { required: 'Car number is required' })}
                />
                {errors.number && <span style={{ color: 'red' }}>{errors.number.message}</span>}
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  className="form-control"
                  {...register('model', { required: 'Model is required' })}
                />
                {errors.model && <span style={{ color: 'red' }}>{errors.model.message}</span>}
              </div>

              <div className="form-group">
                <label>Price per KM (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  {...register('pricePerKm', { required: 'Price per KM is required', min: 0 })}
                />
                {errors.pricePerKm && <span style={{ color: 'red' }}>{errors.pricePerKm.message}</span>}
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  {...register('capacity', { required: 'Capacity is required', min: 1 })}
                />
                {errors.capacity && <span style={{ color: 'red' }}>{errors.capacity.message}</span>}
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select
                  className="form-control"
                  {...register('fuelType', { required: 'Fuel type is required' })}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.fuelType && <span style={{ color: 'red' }}>{errors.fuelType.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                {...register('image')}
                placeholder="https://example.com/car-image.jpg"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingCar ? 'Update Car' : 'Add Car'}
              </button>
              <button type="button" className="btn" onClick={resetForm} style={{ backgroundColor: '#6c757d', color: 'white' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Cars List</h3>
        {cars.length === 0 ? (
          <p>No cars found. Add your first car!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Model</th>
                <th>Capacity</th>
                <th>Fuel Type</th>
                <th>Price/KM</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>{car.name}</td>
                  <td>{car.number}</td>
                  <td>{car.model}</td>
                  <td>{car.capacity}</td>
                  <td>{car.fuelType}</td>
                  <td>₹{car.pricePerKm}</td>
                  <td>
                    <span className={`status-badge ${car.isAvailable ? 'status-assigned' : 'status-pending'}`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        className="btn btn-success"
                        onClick={() => handleEdit(car)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(car._id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCars;