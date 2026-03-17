import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import '../AboutUsRedesign.css';

const AboutUs = () => {
  return (
    <>
      <LandingNavbar />
      <div className="about-us-redesign">
        {/* Hero Section with Gradient */}
        <section className="hero-gradient">
          <div className="hero-container">
            <div className="hero-text">
              <span className="hero-tag">Est. 2020</span>
              <h1 className="hero-title">
                Redefining <span className="gradient-text">Car Rentals</span>
              </h1>
              <p className="hero-subtitle">
                Experience premium mobility with our curated fleet of vehicles, 
                designed for the modern explorer.
              </p>
              <div className="hero-metrics">
                <div className="metric">
                  <h3>1000+</h3>
                  <p>Trips Completed</p>
                </div>
                <div className="metric">
                  <h3>98%</h3>
                  <p>Customer Satisfaction</p>
                </div>
                <div className="metric">
                  <h3>24/7</h3>
                  <p>Support Available</p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-elements">
                <div className="element element-1">
                  <i className="fas fa-car"></i>
                </div>
                <div className="element element-2">
                  <i className="fas fa-route"></i>
                </div>
                <div className="element element-3">
                  <i className="fas fa-shield-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="mission-vision">
          <div className="container">
            <div className="cards-grid">
              <div className="mission-card">
                <div className="card-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To provide seamless, reliable, and premium car rental experiences 
                  that empower every journey with comfort and confidence.
                </p>
              </div>
              <div className="vision-card">
                <div className="card-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To become the most trusted mobility partner, revolutionizing 
                  transportation through innovation and exceptional service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="features-showcase">
          <div className="container">
            <div className="section-intro">
              <h2>Why Choose Karunya?</h2>
              <p>Discover what makes us the preferred choice for discerning travelers</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon blue">
                  <i className="fas fa-certificate"></i>
                </div>
                <h4>Verified Fleet</h4>
                <p>Every vehicle is thoroughly inspected and certified for your safety</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon green">
                  <i className="fas fa-headset"></i>
                </div>
                <h4>24/7 Support</h4>
                <p>Round-the-clock assistance for all your travel needs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon purple">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h4>Easy Booking</h4>
                <p>Book your perfect ride in just a few clicks</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon orange">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <h4>Best Prices</h4>
                <p>Competitive rates with transparent pricing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="team-intro">
              <h2>Meet Our Team</h2>
              <p>Passionate professionals dedicated to your journey</p>
            </div>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <h4>Rajesh Kumar</h4>
                <p>Founder & CEO</p>
                <span>Visionary leader with 10+ years in mobility</span>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-user-cog"></i>
                </div>
                <h4>Priya Sharma</h4>
                <p>Operations Head</p>
                <span>Ensuring seamless customer experiences</span>
              </div>
              <div className="team-member">
                <div className="member-avatar">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h4>Amit Patel</h4>
                <p>Safety Manager</p>
                <span>Your safety is our top priority</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience the Difference?</h2>
              <p>Join thousands of satisfied customers who trust Karunya for their travel needs</p>
              <div className="cta-buttons">
                <a href="/" className="btn-primary">
                  <i className="fas fa-car"></i>
                  Book Your Ride
                </a>
                <a href="tel:+919876543210" className="btn-secondary">
                  <i className="fas fa-phone"></i>
                  Call Now
                </a>
              </div>
              <div className="contact-info">
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <span>info@karunyarentals.com</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;