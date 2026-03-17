import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { carsAPI, bookingsAPI, locationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BookCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [locationData, setLocationData] = useState({ districts: [], touristSpots: {} });
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableSpots, setAvailableSpots] = useState([]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      placesToVisit: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'placesToVisit'
  });

  useEffect(() => {
    fetchCar();
    fetchLocationData();
  }, [carId]);

  const fetchLocationData = async () => {
    try {
      const response = await locationsAPI.getTamilNaduData();
      if (response.data.success) {
        setLocationData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch location data', error);
      toast.error('Failed to load places data');
    }
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    if (district && locationData.touristSpots[district]) {
      setAvailableSpots(locationData.touristSpots[district]);
    } else {
      setAvailableSpots([]);
    }
  };

  const handleSpotSelection = (spot) => {
    const currentSpots = fields.map(field => field.address);
    if (!currentSpots.includes(spot.name)) {
      append({ address: spot.name, distance: spot.distance });
    }
  };

  const totalDistance = fields.reduce((sum, field) => sum + (field.distance || 0), 0);

  const fetchCar = async () => {
    try {
      const response = await carsAPI.getById(carId);
      setCar(response.data);
    } catch (error) {
      toast.error('Failed to fetch car details');
      navigate('/customer/cars');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const bookingData = {
        carId,
        pickupLocation: {
          address: data.pickupAddress,
          coordinates: { lat: 12.9716, lng: 77.5946 } // Mock coordinates
        },
        dropLocation: {
          address: data.dropAddress,
          coordinates: { lat: 12.9716, lng: 77.5946 } // Mock coordinates
        },
        placesToVisit: data.placesToVisit.map(place => ({
          address: place.address,
          coordinates: { lat: 12.9716, lng: 77.5946 } // Mock coordinates
        })),
        pickupDateTime: data.pickupDateTime
      };

      await bookingsAPI.create(bookingData);
      toast.success('Booking created successfully!');
      navigate('/customer/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card">
          <h2>Book {car.name}</h2>
          <img
            src={car.image}
            alt={car.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '15px' }}
          />
          <p><strong>Model:</strong> {car.model}</p>
          <p><strong>Number:</strong> {car.number}</p>
          <p><strong>Capacity:</strong> {car.capacity} persons</p>
          <p><strong>Rate:</strong> ₹{car.pricePerKm}/km</p>
        </div>

        <div className="card">
          <h3>Booking Details</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Pickup Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter pickup address"
                {...register('pickupAddress', { required: 'Pickup location is required' })}
              />
              {errors.pickupAddress && <span style={{ color: 'red' }}>{errors.pickupAddress.message}</span>}
            </div>

            <div className="form-group">
              <label>Drop Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter drop address"
                {...register('dropAddress', { required: 'Drop location is required' })}
              />
              {errors.dropAddress && <span style={{ color: 'red' }}>{errors.dropAddress.message}</span>}
            </div>

            <div className="form-group">
              <label>Pickup Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                {...register('pickupDateTime', { required: 'Pickup date & time is required' })}
              />
              {errors.pickupDateTime && <span style={{ color: 'red' }}>{errors.pickupDateTime.message}</span>}
            </div>

            <div className="form-group">
              <label>Places to Visit (Optional)</label>

              <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
                <label style={{ fontSize: '0.9em', color: '#666' }}>Add New Place</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <select
                    className="form-control"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select District</option>
                    {locationData.districts.sort().map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {selectedDistrict && (
                  <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #eee', borderRadius: '5px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', fontWeight: 'bold' }}>Tourist Spots in {selectedDistrict}:</p>
                    {availableSpots.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableSpots.map(spot => {
                          const isSelected = fields.some(f => f.address === spot.name);
                          return (
                            <button
                              key={spot.name}
                              type="button"
                              onClick={() => !isSelected && handleSpotSelection(spot)}
                              disabled={isSelected}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '15px',
                                border: '1px solid ' + (isSelected ? '#28a745' : '#007bff'),
                                backgroundColor: isSelected ? '#28a745' : 'white',
                                color: isSelected ? 'white' : '#007bff',
                                cursor: isSelected ? 'default' : 'pointer',
                                fontSize: '0.85em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <span>{spot.name}</span>
                              <span style={{ fontSize: '0.8em', opacity: 0.8 }}>({spot.distance} km)</span>
                              {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>No spots found for this district.</p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ margin: 0 }}>Selected Places:</label>
                {fields.length > 0 && (
                  <span style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#28a745' }}>
                    Total Extra Distance: {totalDistance} km
                  </span>
                )}
              </div>

              {fields.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No places selected yet.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fields.map((field, index) => (
                  <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: 'white' }}>
                    <div style={{ flex: 1 }}>
                      <div>{field.address}</div>
                      {field.distance && (
                        <div style={{ fontSize: '0.8em', color: '#666' }}>+{field.distance} km</div>
                      )}
                    </div>
                    <input
                      type="hidden"
                      {...register(`placesToVisit.${index}.address`)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(index)}
                      style={{ padding: '2px 8px', fontSize: '0.8em' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/customer/cars')}
                style={{ backgroundColor: '#6c757d', color: 'white' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCar;