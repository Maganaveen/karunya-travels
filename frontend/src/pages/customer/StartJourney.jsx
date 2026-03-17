import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { carsAPI, bookingsAPI } from '../../services/api';
import { locationAPI } from '../../services/locationAPI';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Invoice from './Invoice';
import './StartJourney.css';

const StartJourney = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [loadingJourney, setLoadingJourney] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [placesToVisit, setPlacesToVisit] = useState([]);
  const [selectedTouristSpots, setSelectedTouristSpots] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tnDistricts, setTnDistricts] = useState([]);
  const [tnTouristSpotsData, setTnTouristSpotsData] = useState({});
  const [selectedCar, setSelectedCar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [timeLeft, setTimeLeft] = useState(300);
  const [returnToStart, setReturnToStart] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  // Dynamic data from API
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [touristSpots, setTouristSpots] = useState({});

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const watchPickupState = watch('state');
  const watchHomeCity = watch('homeCity');
  const selectedStateValue = watchPickupState || selectedState;

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
    fetchTamilNaduData();
  }, []);

  const fetchTamilNaduData = async () => {
    try {
      const response = await locationAPI.getTamilNaduData();
      if (response.data.success) {
        setTnDistricts(response.data.data.districts);
        setTnTouristSpotsData(response.data.data.touristSpots);
      }
    } catch (error) {
      console.error('Failed to fetch Tamil Nadu data:', error);
    }
  };

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedStateValue === 'Tamil Nadu') {
      setCities(tnDistricts);
    } else if (selectedStateValue) {
      fetchCities(selectedStateValue);
    }
  }, [selectedStateValue, tnDistricts]);

  // Fetch tourist spots when cities are selected
  useEffect(() => {
    if (selectedStateValue && placesToVisit.length > 0) {
      fetchTouristSpotsForCities();
    }
  }, [selectedStateValue, placesToVisit]);

  const fetchStates = async () => {
    try {
      const response = await locationAPI.getStates();
      setStates(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch states');
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await locationAPI.getCities(state);
      setCities(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch cities');
    }
  };

  const fetchTouristSpotsForCities = async () => {
    try {
      const spots = {};
      for (const city of placesToVisit) {
        if (selectedStateValue === 'Tamil Nadu' && tnTouristSpotsData[city]) {
          spots[city] = tnTouristSpotsData[city];
          console.log(`Madurai spots from tnTouristSpotsData:`, tnTouristSpotsData['Madurai']);
        } else {
          const response = await locationAPI.getTouristSpots(selectedStateValue, city);
          spots[city] = response.data.data;
        }
      }
      console.log('All tourist spots fetched:', spots);
      setTouristSpots(spots);
    } catch (error) {
      toast.error('Failed to fetch tourist spots');
    }
  };

  const calculatePrice = (distance, days) => {
    const baseRate = 12;
    const dayMultiplier = days > 1 ? 1 + (days - 1) * 0.1 : 1;
    return Math.round(distance * baseRate * dayMultiplier);
  };

  const onSubmit = async (data) => {
    setLoadingJourney(true);
    try {
      if (placesToVisit.length === 0) {
        toast.error('Please select at least one place to visit');
        return;
      }

      // Calculate journey using API
      const response = await locationAPI.calculateJourney(
        data.homeCity,
        placesToVisit,
        selectedTouristSpots
      );

      const { totalDistance: distance, totalTime: time, segments } = response.data.data;
      const days = parseInt(data.days);
      
      console.log('Journey calculation response:', response.data);
      console.log('Segments received:', segments);
      
      // Add return segment if return journey is selected
      let finalSegments = [...(segments || [])];
      let finalDistance = distance;
      let finalTime = time;
      
      if (returnToStart && segments && segments.length > 0) {
        // Add return segment from last location to home
        const lastSegment = segments[segments.length - 1];
        finalSegments.push({
          from: lastSegment.to,
          to: data.homeCity,
          distance: Math.round(distance), // Approximate return distance same as forward
          time: Math.round(time)
        });
        finalDistance = distance * 2;
        finalTime = time * 2;
      }
      
      const price = calculatePrice(finalDistance, days);

      const details = {
        ...data,
        placesToVisit,
        selectedTouristSpots,
        distance: finalDistance,
        price,
        estimatedTime: finalTime,
        additionalNotes: data.additionalNotes || '',
        returnToStart,
        segments: finalSegments
      };

      console.log('Journey details with segments:', details.segments);
      setJourneyDetails(details);

      // Fetch available cars
      setLoadingCars(true);
      const carsResponse = await carsAPI.getAvailable({
        startDate: data.journeyDate,
        endDate: new Date(new Date(data.journeyDate).getTime() + (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      });
      setAvailableCars(carsResponse.data || []);
      toast.success('Journey details calculated and cars loaded!');

      // Scroll to summary
      setTimeout(() => {
        document.getElementById('journey-summary')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (error) {
      console.error('Journey calculation error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to calculate journey details');
      setAvailableCars([]);
    } finally {
      setLoadingCars(false);
      setLoadingJourney(false);
    }
  };

  const bookCar = (car) => {
    if (!user) {
      toast.error('Please sign in to complete your booking');
      navigate('/login');
      return;
    }
    setSelectedCar(car);
    setPaymentMethod('cash');
    setTimeLeft(300);
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    if (paymentMethod === 'upi' && selectedCar && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod, selectedCar, timeLeft]);

  const handleConfirmBooking = async () => {
    try {
      if (!selectedCar) return;

      if (paymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          toast.error('Please fill all card details');
          return;
        }
      }

      if (paymentMethod === 'upi' && timeLeft <= 0) {
        toast.error('Payment time expired. Please try again.');
        return;
      }
      
      const bookingData = {
        carId: selectedCar._id,
        pickupLocation: {
          address: journeyDetails.homeCity,
          coordinates: { lat: 0, lng: 0 }
        },
        dropLocation: {
          address: journeyDetails.placesToVisit[journeyDetails.placesToVisit.length - 1],
          coordinates: { lat: 0, lng: 0 }
        },
        placesToVisit: journeyDetails.placesToVisit.map(place => ({
          address: place,
          coordinates: { lat: 0, lng: 0 }
        })),
        pickupDateTime: new Date(journeyDetails.journeyDate).toISOString(),
        totalDistance: Number(journeyDetails.distance),
        baseAmount: Number(journeyDetails.price),
        totalAmount: Number(journeyDetails.price),
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
      };
      
      await bookingsAPI.create(bookingData);
      toast.success('Booking confirmed! Confirmation email sent.');
      navigate('/customer/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  // Build waypoints for Google Maps including tourist spots
  const buildMapWaypoints = () => {
    if (!journeyDetails) return '';
    
    const waypoints = [];
    journeyDetails.placesToVisit.forEach(city => {
      if (journeyDetails.selectedTouristSpots[city] && journeyDetails.selectedTouristSpots[city].length > 0) {
        journeyDetails.selectedTouristSpots[city].forEach(spot => {
          waypoints.push(encodeURIComponent(`${spot.name}, ${city}, Tamil Nadu, India`));
        });
      } else {
        waypoints.push(encodeURIComponent(`${city}, Tamil Nadu, India`));
      }
    });
    
    return waypoints.join('|');
  };

  // Calculate invoice details
  const getInvoiceData = () => {
    if (!selectedCar || !journeyDetails) return null;

    const pricePerKm = 12;
    const distanceCharge = journeyDetails.distance * pricePerKm;
    const subtotal = distanceCharge;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      pricePerKm,
      distanceCharge,
      subtotal,
      tax,
      total
    };
  };

  // Download Invoice as PDF (using print)
  const downloadInvoicePDF = () => {
    window.print();
  };

  // Download Invoice
  const downloadInvoice = () => {
    if (!selectedCar || !journeyDetails) return;

    const pricePerKm = 12;
    const distanceCharge = journeyDetails.distance * pricePerKm;
    const subtotal = distanceCharge;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    const invoiceContent = `
═══════════════════════════════════════════════════════
              CAR RENTAL BOOKING INVOICE
═══════════════════════════════════════════════════════

Invoice Date: ${new Date().toLocaleDateString()}
Booking ID: ${Date.now()}

-----------------------------------------------------------
CUSTOMER DETAILS
-----------------------------------------------------------
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}

-----------------------------------------------------------
JOURNEY DETAILS
-----------------------------------------------------------
Starting From: ${journeyDetails.homeCity}
Places to Visit: ${journeyDetails.placesToVisit.join(', ')}
${journeyDetails.returnToStart ? `Return To: ${journeyDetails.homeCity}` : ''}
Journey Date: ${new Date(journeyDetails.journeyDate).toLocaleDateString()}
Duration: ${journeyDetails.days} Day(s)
Total Distance: ${journeyDetails.distance} km ${journeyDetails.returnToStart ? '(Round Trip)' : ''}

-----------------------------------------------------------
VEHICLE DETAILS
-----------------------------------------------------------
Car: ${selectedCar.make} ${selectedCar.model}
Fuel Type: ${selectedCar.fuelType}
Capacity: ${selectedCar.capacity} Seats
Registration: ${selectedCar.registrationNumber || 'N/A'}

-----------------------------------------------------------
PRICING BREAKDOWN
-----------------------------------------------------------
Distance Charge:
  ${journeyDetails.distance} km × ₹${pricePerKm}/km = ₹${distanceCharge}

                                    Subtotal: ₹${subtotal}
                                GST (18%): ₹${tax}
-----------------------------------------------------------
                              TOTAL AMOUNT: ₹${total}
═══════════════════════════════════════════════════════

Payment Method: ${paymentMethod.toUpperCase()}
Payment Status: ${paymentMethod === 'cash' ? 'Pending' : 'Paid'}
${advanceAmount ? `Advance Paid: ₹${advanceAmount}` : ''}

-----------------------------------------------------------
TERMS & CONDITIONS
-----------------------------------------------------------
1. Driver must have a valid driving license
2. Fuel charges are included in the rental
3. Toll charges are extra
4. Security deposit may be required
5. Cancellation charges apply as per policy

═══════════════════════════════════════════════════════
          Thank you for choosing our service!
═══════════════════════════════════════════════════════
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Car_Rental_Invoice_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded successfully!');
  };

  return (
    <>
      {/* Hero Section */}
      <div className="journey-hero-section">
        <div className="journey-hero-bg-overlay"></div>
        <div className="journey-hero-content">
          <h1 className="journey-hero-title">Start Your Adventure</h1>
          <p className="journey-hero-subtitle">Experience the freedom of the road. Plan your perfect trip with our intelligent journey planner. Discover new places, estimate costs, and book your ideal ride.</p>
        </div>
      </div>

      <div className="start-journey-page">
        <div className="journey-container">
          {/* Planner Card */}
          <div className="planner-card">
          <div className="card-header-styled">
            <h3 className="section-title"><i className="fas fa-map-marked-alt"></i> Journey Planner</h3>
            <button
              className={`toggle-plan-btn ${showForm ? 'cancel' : ''}`}
              onClick={() => setShowForm(!showForm)}
            >
              <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Plan New Journey'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="journey-form-styled animate-fade-in">
              <div className="form-grid">
                <div className="form-group-styled">
                  <label>Select State</label>
                  <div className="input-wrapper">
                    <div className="input-icon-wrapper"><i className="fas fa-flag"></i></div>
                    <select
                      className="input-styled"
                      {...register('state', { required: 'State is required' })}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setPlacesToVisit([]);
                        setSelectedTouristSpots({});
                      }}
                    >
                      <option value="">Select State...</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <span className="error-text">{errors.state.message}</span>}
                </div>

                <div className="form-group-styled">
                  <label>Starting From (Home District)</label>
                  <div className="input-wrapper">
                    <div className="input-icon-wrapper"><i className="fas fa-home"></i></div>
                    <select
                      className="input-styled"
                      {...register('homeCity', { required: 'Home district is required' })}
                      disabled={!selectedStateValue}
                    >
                      <option value="">Select District...</option>
                      {tnDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  {errors.homeCity && <span className="error-text">{errors.homeCity.message}</span>}
                </div>
              </div>

              {selectedStateValue && watchHomeCity && (
                <>
                  <div className="places-section-styled">
                    <div className="places-header">
                      <label className="section-title" style={{ fontSize: '1.25rem', border: 'none', padding: 0 }}><i className="fas fa-map-pin" style={{ background: 'none', padding: 0, color: '#2563eb' }}></i> Select Places to Visit</label>
                      <div className="places-actions">
                        <button
                          type="button"
                          className="btn-xs btn-outline"
                          onClick={() => setPlacesToVisit([...cities])}
                          style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          className="btn-xs btn-outline"
                          onClick={() => {
                            setPlacesToVisit([]);
                            setSelectedTouristSpots({});
                          }}
                          style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="multi-select-wrapper">
                      <div
                        className={`dropdown-trigger ${dropdownOpen ? 'active' : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fas fa-list-ul text-muted"></i>
                          {placesToVisit.length > 0
                            ? `${placesToVisit.length} Districts Selected`
                            : 'Select Districts to Visit...'}
                        </span>
                        <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                      </div>

                      {dropdownOpen && (
                        <div className="dropdown-menu-styled">
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
                            {(selectedStateValue === 'Tamil Nadu' ? tnDistricts : cities).map(city => (
                              <label key={city} className="checkbox-label" style={{ fontSize: '0.9rem' }}>
                                <input
                                  type="checkbox"
                                  checked={placesToVisit.includes(city)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPlacesToVisit([...placesToVisit, city]);
                                    } else {
                                      const updated = placesToVisit.filter(c => c !== city);
                                      setPlacesToVisit(updated);
                                      setSelectedTouristSpots(prev => {
                                        const newSpots = { ...prev };
                                        delete newSpots[city];
                                        return newSpots;
                                      });
                                    }
                                  }}
                                />
                                <span>{city}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {placesToVisit.length > 0 && (
                      <div className="selected-spots-preview">
                        {placesToVisit.map(city => (
                          <span key={city} className="spot-tag">
                            {city} <i className="fas fa-times" style={{ cursor: 'pointer' }} onClick={() => {
                              const updated = placesToVisit.filter(c => c !== city);
                              setPlacesToVisit(updated);
                            }}></i>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {placesToVisit.length > 0 && Object.keys(touristSpots).length > 0 && (
                    <div className="tourist-spots-block">
                      <h4 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
                        <i className="fas fa-camera" style={{ background: 'none', padding: 0, color: '#2563eb' }}></i> Select Tourist Spots
                      </h4>

                      {placesToVisit.map(city => (
                        <div key={city} className="city-group">
                          <h5 className="city-group-title"><i className="fas fa-city text-primary"></i> {city}</h5>
                          <div className="spots-grid">
                            {touristSpots[city] && touristSpots[city].length > 0 ? (
                              touristSpots[city].map((spot, index) => {
                                const isSelected = !!(selectedTouristSpots[city] &&
                                  selectedTouristSpots[city].some(s => s.name === spot.name));
                                console.log('City:', city, 'Spot:', spot.name, 'isSelected:', isSelected);
                                console.log('selectedTouristSpots[city]:', selectedTouristSpots[city]);
                                  

                                return (
                                  <div
                                    key={index}
                                    className={`spot-checkbox-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                      if (!isSelected) {
                                        setSelectedTouristSpots(prev => ({
                                          ...prev,
                                          [city]: [...(prev[city] || []), spot]
                                        }));
                                      } else {
                                        setSelectedTouristSpots(prev => ({
                                          ...prev,
                                          [city]: prev[city].filter(s => s.name !== spot.name)
                                        }));
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!isSelected}
                                      onChange={() => { }}
                                    />
                                    <div>
                                      <div style={{ fontWeight: '600', color: '#334155' }}>{spot.name}</div>
                                      {spot.distance && <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{spot.distance} km away</div>}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-muted">No tourist spots available</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="form-grid" style={{ marginTop: '2rem' }}>
                <div className="form-group-styled">
                  <label>Journey Date</label>
                  <div className="input-wrapper">
                    <div className="input-icon-wrapper"><i className="fas fa-calendar-alt"></i></div>
                    <input
                      type="date"
                      className="input-styled"
                      {...register('journeyDate', { required: 'Journey date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.journeyDate && <span className="error-text">{errors.journeyDate.message}</span>}
                </div>

                <div className="form-group-styled">
                  <label>Duration (Days)</label>
                  <div className="input-wrapper">
                    <div className="input-icon-wrapper"><i className="fas fa-clock"></i></div>
                    <select className="input-styled" {...register('days', { required: 'Number of days is required' })}>
                      <option value="">Select Duration...</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => (
                        <option key={day} value={day}>{day} {day === 1 ? 'Day' : 'Days'}</option>
                      ))}
                    </select>
                  </div>
                  {errors.days && <span className="error-text">{errors.days.message}</span>}
                </div>
              </div>

              <div className="form-group-styled">
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                  <input
                    type="checkbox"
                    checked={returnToStart}
                    onChange={(e) => setReturnToStart(e.target.checked)}
                    style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>Return to Starting Point</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Include return journey to {watchHomeCity || 'home district'}</div>
                  </div>
                </label>
              </div>

              <div className="form-group-styled">
                <label>Additional Notes (Optional)</label>
                <div className="input-wrapper">
                  <div className="input-icon-wrapper" style={{ top: '1.5rem' }}><i className="fas fa-sticky-note"></i></div>
                  <textarea
                    className="input-styled textarea-styled"
                    placeholder="Any special requests, pick-up details, or preferences?"
                    rows="3"
                    {...register('additionalNotes')}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn-styled" disabled={loadingJourney}>
                {loadingJourney ? (
                  <><i className="fas fa-spinner fa-spin"></i> Calculating Best Routes...</>
                ) : (
                  <><i className="fas fa-search-location"></i> Calculate Journey & Find Cars</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Journey Summary Section */}
        {journeyDetails && (
          <div id="journey-summary" className="summary-card">
            <h2 className="section-title"><i className="fas fa-clipboard-list"></i> Journey Summary</h2>
            <div className="summary-grid">
              <div className="summary-stat">
                <span className="stat-label">Total Distance</span>
                <span className="stat-value"><i className="fas fa-road text-primary" style={{ fontSize: '0.8em', marginRight: '0.5rem' }}></i>{journeyDetails.distance} km</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Est. Time</span>
                <span className="stat-value"><i className="fas fa-clock text-primary" style={{ fontSize: '0.8em', marginRight: '0.5rem' }}></i>{Math.round(journeyDetails.estimatedTime)} mins</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Duration</span>
                <span className="stat-value"><i className="fas fa-calendar-day text-primary" style={{ fontSize: '0.8em', marginRight: '0.5rem' }}></i>{journeyDetails.days} Days</span>
              </div>
              <div className="summary-stat" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <span className="stat-label" style={{ color: '#15803d' }}>Estimated Cost</span>
                <span className="stat-value highlight" style={{ color: '#16a34a' }}>₹{journeyDetails.price}</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '1.5rem', color: '#334155', fontWeight: 'bold' }}>Trip Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Starting From</div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{journeyDetails.homeCity}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Visiting</div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{journeyDetails.placesToVisit.join(', ')}</div>
                </div>
                {journeyDetails.additionalNotes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Notes</div>
                    <div style={{ fontStyle: 'italic' }}>{journeyDetails.additionalNotes}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Route Map */}
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1.5rem', color: '#334155', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-route" style={{ color: '#2563eb' }}></i> Your Journey Route
              </h4>
              
              {/* Segment-by-Segment Distance Breakdown */}
              {journeyDetails.segments && journeyDetails.segments.length > 0 ? (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h5 style={{ marginBottom: '1rem', color: '#334155', fontWeight: '600' }}>Distance Breakdown</h5>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {journeyDetails.segments.filter(segment => segment.from !== segment.to && segment.distance > 0).map((segment, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fas fa-map-marker-alt" style={{ color: '#3b82f6' }}></i>
                          <span style={{ fontWeight: '600' }}>{segment.from}</span>
                          <i className="fas fa-arrow-right" style={{ color: '#94a3b8', fontSize: '0.875rem' }}></i>
                          <span style={{ fontWeight: '600' }}>{segment.to}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '1rem' }}>
                            <i className="fas fa-road" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
                            {segment.distance} km
                          </span>
                          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
                            {segment.time} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#92400e', fontSize: '0.875rem' }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                 Distance breakdown will be available once Google Maps API is configured.
                 </div>
              )}
              
              {/* Visual Route Flow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#10b981', color: 'white', borderRadius: '50px', fontWeight: '600', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)' }}>
                  <i className="fas fa-home"></i>
                  <span>{journeyDetails.homeCity}</span>
                </div>

                <i className="fas fa-arrow-right" style={{ color: '#64748b', fontSize: '1.2rem' }}></i>

                {journeyDetails.placesToVisit.map((place, index) => (
                  <React.Fragment key={place}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#3b82f6', color: 'white', borderRadius: '50px', fontWeight: '600', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{place}</span>
                    </div>
                    {index < journeyDetails.placesToVisit.length - 1 && (
                      <i className="fas fa-arrow-right" style={{ color: '#64748b', fontSize: '1.2rem' }}></i>
                    )}
                  </React.Fragment>
                ))}

                {journeyDetails.returnToStart && (
                  <>
                    <i className="fas fa-arrow-right" style={{ color: '#64748b', fontSize: '1.2rem' }}></i>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#10b981', color: 'white', borderRadius: '50px', fontWeight: '600', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)' }}>
                      <i className="fas fa-home"></i>
                      <span>{journeyDetails.homeCity}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Google Maps Embed */}
              <div style={{ width: '100%', height: '450px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(journeyDetails.homeCity + ', Tamil Nadu, India')}&destination=${encodeURIComponent((journeyDetails.returnToStart ? journeyDetails.homeCity : journeyDetails.placesToVisit[journeyDetails.placesToVisit.length - 1]) + ', Tamil Nadu, India')}&waypoints=${buildMapWaypoints()}&mode=driving`}>
                </iframe>
              </div>
            </div>
          </div>
        )}

        {/* Available Cars Section */}
        {availableCars.length > 0 && (
          <div className="cars-section">
            <div className="section-title" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
              <h2><i className="fas fa-car-side"></i> Only The Best Rides For You</h2>
            </div>

            <div className="cars-grid">
              {availableCars.map(car => (
                <div key={car._id} className="car-card-styled">
                  <div className="car-image-container">
                    <img src={car.image || '/default-car.jpg'} alt={car.model} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Car+Image' }} />
                  </div>
                  <div className="car-content">
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em' }}>Premium Fleet</span>
                    </div>
                    <h4 className="car-title">{car.make} {car.model}</h4>
                    <div className="car-specs">
                      <span className="spec-item"><i className="fas fa-user-friends"></i> {car.capacity} Seats</span>
                      <span className="spec-item"><i className="fas fa-gas-pump"></i> {car.fuelType}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', marginBottom: '1.5rem' }}>
                      <div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Daily Rate</div>
                        <div className="price-tag" style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹{car.pricePerDay}</div>
                      </div>
                    </div>
                    <button
                      className="book-btn"
                      onClick={() => bookCar(car)}
                    >
                      Book This Car
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Payment Section */}
      {selectedCar && (
        <div id="payment-section" className="start-journey-page">
          <div className="journey-container">
            <div className="planner-card">
              <h3 className="section-title"><i className="fas fa-credit-card"></i> Complete Booking</h3>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Customer Details</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Phone:</strong> {user.phone}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Journey Details</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div><strong>Car:</strong> {selectedCar.make} {selectedCar.model}</div>
                  <div><strong>Starting From:</strong> {journeyDetails.homeCity}</div>
                  <div><strong>Places to Visit:</strong> {journeyDetails.placesToVisit.join(', ')}</div>
                  {journeyDetails.returnToStart && <div><strong>Return To:</strong> {journeyDetails.homeCity}</div>}
                  <div><strong>Duration:</strong> {journeyDetails.days} Days</div>
                  <div><strong>Distance:</strong> {journeyDetails.distance} km {journeyDetails.returnToStart && '(Round Trip)'}</div>
                  <div style={{ fontSize: '1.2rem', color: '#16a34a', marginTop: '0.5rem' }}><strong>Total Amount: ₹{journeyDetails.price}</strong></div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Payment Options</h4>
                
                <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', marginBottom: '0.75rem', cursor: 'pointer', background: paymentMethod === 'cash' ? '#eff6ff' : 'white' }}>
                  <input type="radio" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '0.75rem' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pay when you receive the car</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', marginBottom: '0.75rem', cursor: 'pointer', background: paymentMethod === 'upi' ? '#eff6ff' : 'white' }}>
                  <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '0.75rem' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>UPI Payment</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pay via UPI apps</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', background: paymentMethod === 'card' ? '#eff6ff' : 'white' }}>
                  <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '0.75rem' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Card Payment</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pay via Credit/Debit card</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '1rem' }}>
                    <i className="fas fa-clock"></i> Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi%26pn=CarRental%26am=${journeyDetails.price}`} alt="UPI QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', display: 'block' }} />
                  <p style={{ marginTop: '1rem', color: '#64748b' }}>Scan QR code with any UPI app to pay</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Card Details</h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      maxLength="16"
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        maxLength="5"
                        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem' }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        maxLength="3"
                        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Advance Payment (Optional)</label>
                <input
                  type="number"
                  placeholder="Enter advance amount"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  min="0"
                  max={journeyDetails.price}
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem' }}
                />
                <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>Maximum: ₹{journeyDetails.price}</small>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleConfirmBooking} style={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className="fas fa-check-circle"></i> Confirm Booking
                </button>
                <button onClick={() => setShowInvoice(true)} style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className="fas fa-file-invoice"></i> View Invoice
                </button>
                <button onClick={() => setSelectedCar(null)} style={{ flex: 1, background: '#f1f5f9', color: '#334155', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedCar && journeyDetails && (
        <Invoice
          user={user}
          selectedCar={selectedCar}
          journeyDetails={journeyDetails}
          paymentMethod={paymentMethod}
          advanceAmount={advanceAmount}
          onClose={() => setShowInvoice(false)}
          onDownload={downloadInvoicePDF}
        />
      )}
    </>
  );
};

export default StartJourney;