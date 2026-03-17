import React from 'react';

const NavigationSections = () => {
  return (
    <div className="navigation-sections">
      {/* Available Section */}
      <section id="available" className="section-padding">
        <div className="container">
          <h2 className="section-title">Available Cars</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="car-category">
                <img src="/images/economy-car.jpg" alt="Economy Cars" className="car-image" />
                <h4>Economy Cars</h4>
                <p>Perfect for city drives and budget-friendly trips. Starting from ₹1,200/day</p>
                <ul>
                  <li>Fuel efficient</li>
                  <li>Easy parking</li>
                  <li>AC & Music system</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="car-category">
                <img src="/images/luxury-car.jpg" alt="Luxury Cars" className="car-image" />
                <h4>Luxury Cars</h4>
                <p>Premium comfort for special occasions. Starting from ₹3,500/day</p>
                <ul>
                  <li>Premium interiors</li>
                  <li>Advanced safety features</li>
                  <li>Professional chauffeur available</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="car-category">
                <img src="/images/suv-car.jpg" alt="SUV Cars" className="car-image" />
                <h4>SUVs & MUVs</h4>
                <p>Spacious vehicles for family trips. Starting from ₹2,200/day</p>
                <ul>
                  <li>7-8 seater capacity</li>
                  <li>Large luggage space</li>
                  <li>All-terrain capability</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="availability-info">
            <h5>Real-time Availability</h5>
            <p>All our vehicles are GPS tracked and available 24/7. Check real-time availability and book instantly.</p>
          </div>
        </div>
      </section>

      {/* Exclusivity Section */}
      <section id="exclusivity" className="section-padding bg-light">
        <div className="container">
          <h2 className="section-title">Exclusive Benefits</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="exclusive-feature">
                <i className="fas fa-crown feature-icon"></i>
                <h4>VIP Treatment</h4>
                <p>Priority booking, dedicated customer support, and complimentary car wash service for all rentals.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="exclusive-feature">
                <i className="fas fa-shield-alt feature-icon"></i>
                <h4>Premium Insurance</h4>
                <p>Comprehensive insurance coverage with zero deductible and 24/7 roadside assistance included.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="exclusive-feature">
                <i className="fas fa-user-tie feature-icon"></i>
                <h4>Professional Drivers</h4>
                <p>Experienced, licensed, and background-verified drivers available for all vehicle categories.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="exclusive-feature">
                <i className="fas fa-mobile-alt feature-icon"></i>
                <h4>Smart App Features</h4>
                <p>Real-time tracking, digital payments, instant booking confirmations, and trip history management.</p>
              </div>
            </div>
          </div>
          <div className="membership-info">
            <h5>Exclusive Membership Program</h5>
            <p>Join our premium membership for additional discounts, priority support, and exclusive access to luxury vehicles.</p>
            <button className="btn btn-primary">Join Now</button>
          </div>
        </div>
      </section>

      {/* Rentals Section */}
      <section id="rentals" className="section-padding">
        <div className="container">
          <h2 className="section-title">Rental Options</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="rental-option">
                <i className="fas fa-clock rental-icon"></i>
                <h4>Hourly Rentals</h4>
                <p>Perfect for short trips and city errands</p>
                <ul>
                  <li>Minimum 3 hours</li>
                  <li>₹200-500 per hour</li>
                  <li>Fuel included</li>
                  <li>Driver optional</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rental-option">
                <i className="fas fa-calendar-day rental-icon"></i>
                <h4>Daily Rentals</h4>
                <p>Ideal for day trips and local sightseeing</p>
                <ul>
                  <li>8-12 hours coverage</li>
                  <li>₹1,200-3,500 per day</li>
                  <li>200km included</li>
                  <li>Professional driver</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rental-option">
                <i className="fas fa-calendar-week rental-icon"></i>
                <h4>Long-term Rentals</h4>
                <p>Best for extended stays and business trips</p>
                <ul>
                  <li>Weekly/Monthly packages</li>
                  <li>Special discounted rates</li>
                  <li>Unlimited kilometers</li>
                  <li>Maintenance included</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="booking-process">
            <h5>Simple Booking Process</h5>
            <div className="process-steps">
              <div className="step">
                <span className="step-number">1</span>
                <p>Choose your car and rental duration</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Provide pickup details and contact info</p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Confirm booking with secure payment</p>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <p>Enjoy your ride with our premium service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section-padding bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 className="section-title">About Us</h2>
              <p className="lead">
                Your trusted partner for premium car rental services since 2020. We provide reliable, 
                comfortable, and affordable transportation solutions for all your travel needs.
              </p>
              <div className="company-stats">
                <div className="stat">
                  <h4>500+</h4>
                  <p>Happy Customers</p>
                </div>
                <div className="stat">
                  <h4>50+</h4>
                  <p>Premium Vehicles</p>
                </div>
                <div className="stat">
                  <h4>24/7</h4>
                  <p>Customer Support</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h5>Address</h5>
                    <p>123 Business District, Tech City<br />Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h5>Phone</h5>
                    <p>+91 98765 43210<br />+91 87654 32109</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h5>Email</h5>
                    <p>info@carrental.com<br />support@carrental.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h5>Business Hours</h5>
                    <p>24/7 Service Available<br />Office: Mon-Sat 9AM-8PM</p>
                  </div>
                </div>
              </div>
              <div className="social-links">
                <h5>Follow Us</h5>
                <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section id="conditions" className="section-padding">
        <div className="container">
          <h2 className="section-title">Terms & Conditions</h2>
          <div className="row">
            <div className="col-md-6">
              <h4>Rental Requirements</h4>
              <ul className="conditions-list">
                <li>Valid driving license (minimum 1 year old)</li>
                <li>Age requirement: 21-65 years</li>
                <li>Government-issued photo ID proof</li>
                <li>Security deposit as per vehicle category</li>
                <li>Advance booking confirmation</li>
              </ul>
              
              <h4>Payment Terms</h4>
              <ul className="conditions-list">
                <li>50% advance payment required</li>
                <li>Balance payment before vehicle delivery</li>
                <li>Security deposit refundable after inspection</li>
                <li>Fuel charges extra (if applicable)</li>
                <li>Toll charges to be borne by customer</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h4>Usage Guidelines</h4>
              <ul className="conditions-list">
                <li>No smoking or alcohol consumption in vehicles</li>
                <li>Return vehicle in same condition</li>
                <li>Report any damage immediately</li>
                <li>Follow traffic rules and regulations</li>
                <li>Vehicle not to be used for commercial purposes</li>
              </ul>
              
              <h4>Cancellation Policy</h4>
              <ul className="conditions-list">
                <li>Free cancellation up to 24 hours before pickup</li>
                <li>50% charges for cancellation within 24 hours</li>
                <li>No refund for no-show bookings</li>
                <li>Emergency cancellations considered case by case</li>
                <li>Refund processed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NavigationSections;