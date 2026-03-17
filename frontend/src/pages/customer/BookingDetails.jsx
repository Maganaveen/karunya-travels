import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const BookingDetails = () => {
  const navigate = useNavigate();
  const [bookingData] = useState({
    carName: 'Limousine Car 2024',
    carModel: 'Premium Luxury',
    carImage: '🚗',
    pickupLocation: 'Downtown Station',
    dropLocation: 'Airport Terminal',
    pickupDate: '2024-12-27',
    pickupTime: '10:00 AM',
    dropDate: '2024-12-27',
    dropTime: '5:00 PM',
    estimatedHours: 7,
    hourlyRate: 50,
    subtotal: 350,
    taxes: 52.50,
    discount: 0,
    totalAmount: 402.50,
    features: ['Air Conditioning', 'Power Steering', 'Backup Camera', 'Bluetooth'],
    insurance: true,
    insuranceCost: 25
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleConfirmBooking = () => {
    if (termsAccepted) {
      navigate('/customer/bookings');
    }
  };

  const handleCancel = () => {
    navigate('/customer/cars');
  };

  return (
    <Layout>
      <div className="booking-details-page">
        <div className="page-header">
          <h1>Booking Details</h1>
          <p>Review and confirm your booking</p>
        </div>

        <div className="booking-container">
          <div className="booking-main">
            <div className="car-summary card">
              <div className="car-summary-header">
                <h3>Selected Vehicle</h3>
              </div>
              <div className="car-summary-content">
                <div className="car-summary-image">
                  <span>{bookingData.carImage}</span>
                </div>
                <div className="car-summary-info">
                  <h4>{bookingData.carName}</h4>
                  <p className="car-model">{bookingData.carModel}</p>
                  <div className="car-features">
                    <h5>Features:</h5>
                    <div className="features-list">
                      {bookingData.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <i className="fas fa-check"></i> {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="journey-summary card">
              <div className="journey-header">
                <h3>Journey Details</h3>
              </div>
              <div className="journey-details">
                <div className="journey-location">
                  <div className="location-item">
                    <i className="fas fa-map-marker-alt pickup"></i>
                    <div className="location-info">
                      <label>Pickup Location</label>
                      <p>{bookingData.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="location-line"></div>
                  <div className="location-item">
                    <i className="fas fa-map-marker-alt dropoff"></i>
                    <div className="location-info">
                      <label>Drop Location</label>
                      <p>{bookingData.dropLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="journey-timeline">
                  <div className="timeline-item">
                    <div className="timeline-label">Pickup</div>
                    <div className="timeline-value">
                      <span className="date">{bookingData.pickupDate}</span>
                      <span className="time">{bookingData.pickupTime}</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-label">Drop-off</div>
                    <div className="timeline-value">
                      <span className="date">{bookingData.dropDate}</span>
                      <span className="time">{bookingData.dropTime}</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-label">Duration</div>
                    <div className="timeline-value">
                      <span className="duration">{bookingData.estimatedHours} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="terms-conditions card">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>

          <div className="booking-sidebar">
            <div className="cost-summary card">
              <div className="cost-header">
                <h3>Estimated Total Amount</h3>
              </div>

              <div className="cost-breakdown">
                <div className="cost-item">
                  <span className="cost-label">
                    {bookingData.estimatedHours} hours × ${bookingData.hourlyRate}/hr
                  </span>
                  <span className="cost-value">${bookingData.subtotal}</span>
                </div>

                <div className="cost-item">
                  <span className="cost-label">Taxes & Fees</span>
                  <span className="cost-value">${bookingData.taxes}</span>
                </div>

                {bookingData.insurance && (
                  <div className="cost-item">
                    <span className="cost-label">Insurance</span>
                    <span className="cost-value">${bookingData.insuranceCost}</span>
                  </div>
                )}

                {bookingData.discount > 0 && (
                  <div className="cost-item discount">
                    <span className="cost-label">Discount</span>
                    <span className="cost-value">-${bookingData.discount}</span>
                  </div>
                )}
              </div>

              <div className="cost-divider"></div>

              <div className="cost-total">
                <span className="total-label">Total Amount</span>
                <span className="total-value">${bookingData.totalAmount}</span>
              </div>

              <div className="payment-methods">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>Digital Wallet</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="booking-actions">
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={handleConfirmBooking}
                disabled={!termsAccepted}
              >
                <i className="fas fa-check-circle"></i> Confirm Booking
              </button>
              <button
                className="btn btn-secondary btn-lg btn-block"
                onClick={handleCancel}
              >
                <i className="fas fa-times-circle"></i> Cancel
              </button>
            </div>

            <div className="booking-support card">
              <h4>Need Help?</h4>
              <p>Contact our support team</p>
              <a href="tel:+1234567890" className="support-link">
                <i className="fas fa-phone"></i> +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetails;
