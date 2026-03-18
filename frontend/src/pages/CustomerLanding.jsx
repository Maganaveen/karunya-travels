import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import LandingNavbar from '../components/LandingNavbar';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { toast } from 'react-toastify';

const CustomerLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Calculate estimated distance and price
  const calculateEstimate = () => {
    if (pickupLocation && dropLocation) {
      // Simple estimation: 1 char difference = ~0.5km (mock calculation)
      const distance = Math.max(5, Math.abs(pickupLocation.length - dropLocation.length) * 2 + 10);
      const price = distance * 15; // ₹15 per km
      setEstimatedDistance(distance);
      setEstimatedPrice(price);
    }
  };

  const handleNextSlide = () => {
    if (!phone || !name || !email || !pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
      toast.error('Please fill all fields');
      return;
    }
    calculateEstimate();
    setCurrentSlide(2);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(1);
  };

  const handleStartJourney = () => {
    navigate('/start-journey');
  };

  const handleViewCars = () => {
    navigate('/customer/cars');
  };

  const handleSendOtp = async () => {
    if (!phone || !name || !email || !pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const bookingData = {
        name,
        phone,
        email,
        pickupLocation,
        dropLocation,
        pickupDate,
        pickupTime
      };
      await bookingsAPI.sendOTP(bookingData);
      setShowOtp(true);
      setMessage('OTP sent to your email address');
      toast.success('OTP sent to your email address');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      await bookingsAPI.verifyOTP(phone, otp);
      setShowOtp(false);
      toast.success('Booking Confirmed! Form will be reset for a new booking.');
      // Reset form
      setTimeout(() => {
        setPickupLocation('');
        setDropLocation('');
        setPickupDate('');
        setPickupTime('');
        setPhone('');
        setName('');
        setEmail('');
        setOtp('');
        setMessage('');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };



  const handleBooking = () => {
    navigate('/customer/cars');
  };

  return (
    <>
      <LandingNavbar />
      <div className="landing-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text">
              <h1>Your Journey Begins Here</h1>
              <button className="btn btn-primary btn-lg hero-btn" >
                <i className="fas fa-arrow-right"></i> Start Trip
              </button>
            </div>

            <div className="booking-form card">
              {currentSlide === 1 ? (
                // Slide 1: Booking Details
                <>
                  <div className="form-row">
                    <LocationAutocomplete
                      label="Pickup Location"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={setPickupLocation}
                    />
                    <LocationAutocomplete
                      label="Drop Location"
                      placeholder="Enter drop location"
                      value={dropLocation}
                      onChange={setDropLocation}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Pick up Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary w-100" onClick={handleNextSlide}>
                      Next: Payment Details
                    </button>
                  </div>
                </>
              ) : (
                // Slide 2: Payment Details
                <>
                  <div className="form-group">
                    <button className="btn btn-link p-0" onClick={handlePrevSlide}>
                      <i className="fas fa-arrow-left"></i> Back to Booking Details
                    </button>
                  </div>
                  
                  <div className="booking-summary-card">
                    <div className="summary-card-header">
                      <i className="fas fa-receipt"></i>
                      <h6>Booking Summary</h6>
                    </div>
                    <div className="summary-card-body">
                      <div className="summary-route">
                        <div className="summary-row">
                          <div className="summary-icon pickup"><i className="fas fa-circle"></i></div>
                          <div className="summary-info">
                            <span className="summary-label">Pickup</span>
                            <span className="summary-value">{pickupLocation}</span>
                          </div>
                        </div>
                        <div className="summary-line"></div>
                        <div className="summary-row">
                          <div className="summary-icon drop"><i className="fas fa-map-marker-alt"></i></div>
                          <div className="summary-info">
                            <span className="summary-label">Drop</span>
                            <span className="summary-value">{dropLocation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="summary-divider"></div>
                      <div className="summary-details">
                        <div className="summary-detail-item">
                          <i className="fas fa-calendar-alt"></i>
                          <span>{pickupDate} at {pickupTime}</span>
                        </div>
                        <div className="summary-detail-item">
                          <i className="fas fa-road"></i>
                          <span>~{estimatedDistance} km</span>
                        </div>
                      </div>
                      <div className="summary-price">
                        <span>Estimated Fare</span>
                        <strong>₹{estimatedPrice}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <div className="payment-method-cards">
                      {/* <div
                        className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <i className="fas fa-credit-card"></i>
                        <span>Card</span>
                      </div> */}
                      <div
                        className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <i className="fas fa-qrcode"></i>
                        <span>UPI</span>
                      </div>
                      <div
                        className={`payment-method-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Cash</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="card-payment-section">
                      <div className="form-group">
                        <label>Card Number</label>
                        <div className="input-icon-wrapper">
                          <i className="far fa-credit-card"></i>
                          <input
                            type="text"
                            className="form-control icon-input"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            maxLength="19"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry</label>
                          <div className="input-icon-wrapper">
                            <i className="far fa-calendar"></i>
                            <input
                              type="text"
                              className="form-control icon-input"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              maxLength="5"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <div className="input-icon-wrapper">
                            <i className="fas fa-lock"></i>
                            <input
                              type="password"
                              className="form-control icon-input"
                              placeholder="•••"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              maxLength="4"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <div className="input-icon-wrapper">
                          <i className="far fa-user"></i>
                          <input
                            type="text"
                            className="form-control icon-input"
                            placeholder="Name on card"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="card-secure-badge">
                        <i className="fas fa-shield-alt"></i>
                        <span>Your payment is secured with 256-bit encryption</span>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="upi-payment-section">
                      <div className="upi-qr-container">
                        <p className="upi-scan-text">Scan QR to pay ₹{estimatedPrice}</p>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=karunyatravels@upi&pn=Karunya%20Travels&am=${estimatedPrice}&cu=INR`}
                          alt="UPI QR Code"
                          className="upi-qr-image"
                        />
                        <div className="upi-id-display">
                          <span>UPI ID:</span>
                          <strong>karunyatravels@upi</strong>
                        </div>
                      </div>
                      <div className="upi-divider"><span>or pay via UPI ID</span></div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your UPI ID (e.g. name@upi)"
                        />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'cash' && (
                    <div className="cash-payment-section">
                      <div className="cash-info">
                        <div className="cash-icon-circle">
                          <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <h6>Pay with Cash</h6>
                        <p className="cash-amount">₹{estimatedPrice}</p>
                        <p>Pay the driver in cash at the time of pickup. No advance payment required.</p>
                      </div>
                    </div>
                  )}
                  {!showOtp ? (
                    <div className="form-group">
                      <button className="btn btn-primary w-100" onClick={handleSendOtp} disabled={loading}>
                        {loading ? (
                          <>
                            <i className="fas fa-steering-wheel fa-spin"></i> Processing...
                          </>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Enter OTP</label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          placeholder="1234"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="form-control"
                        />
                        <button className="btn btn-success" onClick={handleVerifyOtp} disabled={otpLoading}>
                          {otpLoading ? (
                            <i className="fas fa-steering-wheel fa-spin"></i>
                          ) : (
                            'Confirm'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {message && <p className="text-success mt-2 mb-0" style={{ fontSize: '0.8rem' }}>{message}</p>}
                </>
              )}
            </div>
          </div>
        </div>



        {/* Car Categories Section */}
        <section className="car-categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Cars</h2>
              <button className="btn btn-outline-primary" onClick={handleViewCars}>View all cars</button>
            </div>

            <div className="car-categories">
              <div className="car-category">
                <div className="category-header">
                  <h3>Limousine Cars</h3>
                  <span className="duration">Mar 30 Ago</span>
                </div>
                <div className="category-body">
                  <div className="car-image">
                    <i className="fas fa-car"></i>
                  </div>
                  <div className="category-details">
                    <p className="detail-tag">Luxury</p>
                    <p className="detail-tag">Premium Travel</p>
                  </div>
                </div>
                <div className="category-footer">
                  <button className="btn btn-primary btn-sm">View More</button>
                </div>
              </div>

              <div className="car-category featured">
                <div className="featured-badge">
                  <i className="fas fa-star"></i>
                </div>
                <div className="category-header">
                  <h3>Prestige Cars</h3>
                  <span className="duration">Starts 30 min</span>
                </div>
                <div className="category-body">
                  <div className="car-image">
                    <i className="fas fa-car"></i>
                  </div>
                  <div className="category-details">
                    <p className="detail-tag">Premium</p>
                    <p className="detail-tag">Luxury Travel</p>
                  </div>
                </div>
                <div className="category-footer">
                  <button className="btn btn-primary btn-sm">Book Now</button>
                </div>
              </div>

              <div className="car-category">
                <div className="category-header">
                  <h3>Economy Cars</h3>
                  <span className="duration">Mar 28 Ago</span>
                </div>
                <div className="category-body">
                  <div className="car-image">
                    <i className="fas fa-car"></i>
                  </div>
                  <div className="category-details">
                    <p className="detail-tag">Budget</p>
                    <p className="detail-tag">Daily Rental</p>
                  </div>
                </div>
                <div className="category-footer">
                  <button className="btn btn-primary btn-sm">View More</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works-section">
          <div className="container">
            <h2>How To Book a Car Online</h2>
            <p className="section-subtitle">Book a car online in India from Karunya in 4 Simple steps</p>
            <div className="steps-zigzag">
              <div className="step-item step-left">
                <div className="step-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="step-content">
                  <h4>1. Select City & Travel Dates</h4>
                  <p>Choose your pickup location and travel dates</p>
                </div>
              </div>
              <div className="step-item step-right">
                <div className="step-icon">
                  <i className="fas fa-car"></i>
                </div>
                <div className="step-content">
                  <h4>2. Choose Car</h4>
                  <p>Select from our wide range of vehicles</p>
                </div>
              </div>
              <div className="step-item step-left">
                <div className="step-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="step-content">
                  <h4>3. Verify Yourself</h4>
                  <p>Complete identity verification process</p>
                </div>
              </div>
              <div className="step-item step-right">
                <div className="step-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="step-content">
                  <h4>4. Make Payment</h4>
                  <p>Secure payment and confirm booking</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Ride with Karunya Section */}
        <section className="why-choose-section">
          <div className="container">
            <h2>Why ride with Karunya?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="feature-content">
                  <h4>Multiple Payment Options</h4>
                  <p>Don't let payment mode come in between you and your dream car! Choose from credit card, debit card, net banking, or UPI</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="feature-content">
                  <h4>Easy Cancellation</h4>
                  <p>Change of plans made easy with Karunya. Enjoy the flexibility to cancel your rental car reservation with just a few clicks</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-tag"></i>
                </div>
                <div className="feature-content">
                  <h4>Best Price Guarantee</h4>
                  <p>We guarantee the lowest prices on self-drive car rentals and subscriptions in India!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <h3>Ready to Explore?</h3>
                <p>Book your perfect ride today and experience premium car rental service</p>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleBooking}>
                <i className="fas fa-car"></i> Explore Cars Now
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Call Button - Bottom Left */}
      <a
        href="tel:9626566567"
        className="call-float-btn"
        title="Call Us"
      >
        <i className="fas fa-phone-alt"></i>
      </a>
    </>
  );
};

export default CustomerLanding;