import React, { useState, useEffect } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import { useNavigate } from 'react-router-dom';

const AvailableCarsPublic = () => {
  const navigate = useNavigate();
  const [cars] = useState([
    {
      id: 1,
      name: 'Toyota Camry',
      type: 'Sedan',
      price: 2500,
      rating: 4.8,
      features: ['AC', 'GPS', 'Bluetooth'],
      available: true
    },
    {
      id: 2,
      name: 'Honda CR-V',
      type: 'SUV',
      price: 3500,
      rating: 4.7,
      features: ['AC', 'GPS', 'Sunroof'],
      available: true
    },
    {
      id: 3,
      name: 'BMW 3 Series',
      type: 'Luxury',
      price: 5500,
      rating: 4.9,
      features: ['AC', 'GPS', 'Leather Seats'],
      available: true
    },
    {
      id: 4,
      name: 'Maruti Swift',
      type: 'Hatchback',
      price: 1800,
      rating: 4.5,
      features: ['AC', 'Music System'],
      available: true
    },
    {
      id: 5,
      name: 'Mahindra Thar',
      type: 'SUV',
      price: 4000,
      rating: 4.6,
      features: ['4WD', 'AC', 'GPS'],
      available: false
    },
    {
      id: 6,
      name: 'Hyundai Verna',
      type: 'Sedan',
      price: 2800,
      rating: 4.4,
      features: ['AC', 'GPS', 'Bluetooth'],
      available: true
    }
  ]);

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

          <div className="cars-grid">
            {cars.map(car => (
              <div key={car.id} className="car-card">
                <div className="car-image-wrapper">
                  <div className="car-image">
                    <i className="fas fa-car"></i>
                  </div>
                  <div className={`status-badge ${car.available ? 'status-ready' : 'status-booked'}`}>
                    {car.available ? 'Available' : 'Booked'}
                  </div>
                </div>
                
                <div className="car-details">
                  <div className="car-header">
                    <h4>{car.name}</h4>
                    <div className="car-rating">
                      <i className="fas fa-star"></i>
                      {car.rating}
                    </div>
                  </div>
                  
                  <div className="car-meta">
                    <span className="car-type">{car.type}</span>
                  </div>
                  
                  <div className="car-features">
                    {car.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        <i className="fas fa-check"></i>
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="car-footer">
                    <div className="car-price">
                      <span className="price-label">Per Day</span>
                      <span className="price">₹{car.price}</span>
                    </div>
                    <button 
                      className={`btn ${car.available ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={handleBookNow}
                      disabled={!car.available}
                    >
                      {car.available ? 'Book Now' : 'Not Available'}
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
                <i className="fas fa-sign-in-alt"></i>
                Login to Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableCarsPublic;