import React, { useState, useEffect } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import { useNavigate } from 'react-router-dom';
import { carsAPI } from '../services/api';
import carPlaceholder from '../assets/car-placeholder.jpg';

const AvailableCarsPublic = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carsAPI.getAll();
        setCars(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleBookNow = () => {
    navigate('/login');
  };

  return (
    <>
      <LandingNavbar />
      <div className="available-cars-page">
        <div className="container">
          <div className="page-header">
            <h1>Available Cars</h1>
            <p>Choose from our premium fleet of vehicles</p>
          </div>

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
              <p>Loading cars...</p>
            </div>
          )}

          {error && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '1rem' }}></i>
              <p style={{ color: '#dc2626', fontWeight: '600' }}>{error}</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i> Retry
              </button>
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-car" style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }}></i>
              <p>No cars available at the moment.</p>
            </div>
          )}

          <div className="cars-grid">
            {cars.map(car => (
              <div key={car._id} className="car-card">
                <div className="car-image-wrapper">
                  <div className="car-image" style={{ overflow: 'hidden' }}>
                    <img
                      src={car.image || carPlaceholder}
                      alt={car.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = carPlaceholder; }}
                    />
                  </div>
                  <div className="status-badge status-ready">Available</div>
                </div>

                <div className="car-details">
                  <div className="car-header">
                    <h4>{car.name}</h4>
                    <div className="car-rating">
                      <i className="fas fa-star"></i> 4.8
                    </div>
                  </div>

                  <div className="car-meta">
                    <span className="car-type">{car.category || 'Standard'}</span>
                  </div>

                  <div className="car-features">
                    <span className="feature-tag"><i className="fas fa-users"></i> {car.capacity} Seats</span>
                    <span className="feature-tag"><i className="fas fa-gas-pump"></i> {car.fuelType}</span>
                  </div>

                  <div className="car-footer">
                    <div className="car-price">
                      <span className="price-label">Per KM</span>
                      <span className="price">₹{car.pricePerKm}</span>
                    </div>
                    <button className="btn btn-primary" onClick={handleBookNow}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-section">
            <div className="cta-content">
              <h3>Ready to Book Your Perfect Ride?</h3>
              <p>Login to access booking features and manage your reservations</p>
              <button className="btn btn-primary btn-lg" onClick={handleBookNow}>
                <i className="fas fa-sign-in-alt"></i> Login to Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableCarsPublic;
