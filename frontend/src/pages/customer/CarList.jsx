import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import carPlaceholder from '../../assets/car-placeholder.jpg';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAll();
      setCars(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleBookCar = (carId) => {
    navigate(`/customer/book/${carId}`);
  };

  if (loading) return (
    <div className="loading" style={{ minHeight: '80vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="section" style={{ minHeight: '100vh', paddingTop: '40px' }}>
      <div className="container">
        <div className="text-center mb-4">
          <h2 style={{ fontSize: '2.5rem' }}>
            Choose Your <span className="text-gradient">Perfect Ride</span>
          </h2>
          <p>Explore our wide range of premium vehicles for your journey</p>
        </div>

        {cars.length === 0 ? (
          <div className="card text-center" style={{ padding: '60px' }}>
            <i className="fas fa-car" style={{ fontSize: '4rem', color: 'var(--gray-text)', marginBottom: '20px' }}></i>
            <p>No cars available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {cars.map((car, index) => (
              <div key={car._id} className="card car-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div style={{ height: '240px', overflow: 'hidden', borderRadius: '1rem 1rem 0 0', position: 'relative' }}>
                  <img
                    src={car.image || carPlaceholder}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => { e.target.onerror = null; e.target.src = carPlaceholder; }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                    <span style={{ color: 'white', fontSize: '0.8rem' }}><i className="fas fa-star" style={{ color: 'var(--warning)' }}></i> 4.9</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{car.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-text)' }}>{car.model} • {car.number}</p>
                    </div>
                    <div className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                      ₹{car.pricePerKm}<span style={{ fontSize: '0.9rem', color: 'var(--gray-text)', fontWeight: '400' }}>/km</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '15px',
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      {car.category || 'Standard'}
                    </span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-text)', lineHeight: '1.4', margin: 0 }}>
                      <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
                      {car.description || 'Available for rent'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gray-text)' }}>
                      <i className="fas fa-users" style={{ color: 'var(--primary)', width: '20px' }}></i> {car.capacity} Seats
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gray-text)' }}>
                      <i className="fas fa-gas-pump" style={{ color: 'var(--secondary)', width: '20px' }}></i> {car.fuelType}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gray-text)' }}>
                      <i className="fas fa-cog" style={{ color: 'var(--accent)', width: '20px' }}></i> Auto
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gray-text)' }}>
                      <i className="fas fa-snowflake" style={{ color: 'var(--success)', width: '20px' }}></i> AC
                    </span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => handleBookCar(car._id)}
                  >
                    <i className="fas fa-calendar-check"></i> Book Now
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

export default CarList;