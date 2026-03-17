import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

const AvailableCars = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      name: 'Limousine Car',
      type: 'Limousine',
      duration: '2 mins',
      availability: 'Available',
      price: '$50/hr',
      status: 'ready',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Prestige Car',
      type: 'Premium',
      duration: '4 mins',
      availability: 'Available',
      price: '$60/hr',
      status: 'ready',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Economy Car',
      type: 'Budget',
      duration: '6 mins',
      availability: 'Available',
      price: '$30/hr',
      status: 'ready',
      rating: 4.5
    },
    {
      id: 4,
      name: 'SUV Premium',
      type: 'Luxury',
      duration: '3 mins',
      availability: 'Available',
      price: '$70/hr',
      status: 'ready',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Sedan Comfort',
      type: 'Standard',
      duration: '5 mins',
      availability: 'Available',
      price: '$40/hr',
      status: 'ready',
      rating: 4.6
    },
    {
      id: 6,
      name: 'VAN Large',
      type: 'Group',
      duration: '7 mins',
      availability: 'Available',
      price: '$80/hr',
      status: 'ready',
      rating: 4.4
    }
  ]);

  const [filteredCars, setFilteredCars] = useState(cars);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const carTypes = [
    { id: 'all', label: 'All Cars', count: 6 },
    { id: 'limousine', label: 'Limousine Cars', count: 2 },
    { id: 'premium', label: 'Prestige Cars', count: 2 },
    { id: 'budget', label: 'Economy Cars', count: 1 },
    { id: 'luxury', label: 'Luxury', count: 1 }
  ];

  const durations = [
    { id: 'all', label: 'All', range: 'All times' },
    { id: '0-4', label: '0-4 mins', range: '0-4' },
    { id: '4-7', label: '4-7 mins', range: '4-7' },
    { id: '7-10', label: '7-10 mins', range: '7-10' }
  ];

  useEffect(() => {
    let filtered = cars;

    if (selectedType !== 'all') {
      filtered = filtered.filter(car => car.type.toLowerCase().includes(selectedType));
    }

    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCars(filtered);
  }, [selectedType, searchTerm, cars]);

  const handleBooking = (carId) => {
    console.log('Booking car:', carId);
  };

  return (
    <Layout>
      <div className="available-cars-page">
        <div className="page-header">
          <h1>Available Cars</h1>
          <p>Choose from our premium fleet of vehicles</p>
        </div>

        <div className="cars-filters-section">
          <div className="filter-panel">
            <div className="filter-group">
              <h3 className="filter-title">Car Types</h3>
              <div className="filter-options">
                {carTypes.map(type => (
                  <label key={type.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="carType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <span className="checkbox-label">{type.label}</span>
                    <span className="filter-count">{type.count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Duration</h3>
              <div className="filter-options">
                {durations.map(duration => (
                  <label key={duration.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="duration"
                      value={duration.id}
                      checked={selectedDuration === duration.id}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                    />
                    <span className="checkbox-label">{duration.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="cars-list-section">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search cars by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="cars-header">
              <h2>Available Cars ({filteredCars.length})</h2>
            </div>

            <div className="cars-grid">
              {filteredCars.map(car => (
                <div key={car.id} className="car-card">
                  <div className="car-image-wrapper">
                    <div className="car-image">
                      <i className="fas fa-car"></i>
                    </div>
                    <span className={`status-badge status-${car.status}`}>
                      {car.status === 'ready' ? 'Ready' : 'Booked'}
                    </span>
                  </div>

                  <div className="car-details">
                    <div className="car-header">
                      <h4>{car.name}</h4>
                      <div className="car-rating">
                        <i className="fas fa-star"></i>
                        <span>{car.rating}</span>
                      </div>
                    </div>

                    <div className="car-meta">
                      <span className="car-type">{car.type}</span>
                      <span className="car-duration">
                        <i className="fas fa-clock"></i> {car.duration}
                      </span>
                    </div>

                    <p className="car-availability">
                      <i className="fas fa-check-circle"></i> {car.availability}
                    </p>

                    <div className="car-footer">
                      <div className="car-price">
                        <span className="price-label">From</span>
                        <span className="price">{car.price}</span>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBooking(car.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-search"></i>
                <p>No cars found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AvailableCars;
