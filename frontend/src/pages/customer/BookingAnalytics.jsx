import React, { useState } from 'react';
import Layout from '../../components/Layout';

const BookingAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = [
    {
      id: 1,
      label: 'Total Bookings',
      value: '24',
      change: '+12%',
      icon: 'fa-calendar-check',
      color: 'blue'
    },
    {
      id: 2,
      label: 'Completed Rides',
      value: '18',
      change: '+8%',
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      id: 3,
      label: 'Pending Bookings',
      value: '4',
      change: '+2%',
      icon: 'fa-clock',
      color: 'orange'
    },
    {
      id: 4,
      label: 'Total Spent',
      value: '$1,240',
      change: '+18%',
      icon: 'fa-wallet',
      color: 'purple'
    }
  ];

  const monthlyData = [
    { month: 'Jan', bookings: 5, rides: 3 },
    { month: 'Feb', bookings: 8, rides: 6 },
    { month: 'Mar', bookings: 6, rides: 4 },
    { month: 'Apr', bookings: 12, rides: 10 },
    { month: 'May', bookings: 15, rides: 12 },
    { month: 'Jun', bookings: 24, rides: 18 }
  ];

  const bookingTypes = [
    { type: 'Economy', count: 8, percentage: 33 },
    { type: 'Premium', count: 10, percentage: 42 },
    { type: 'Luxury', count: 6, percentage: 25 }
  ];

  const recentBookings = [
    {
      id: 1,
      date: '2024-06-15',
      car: 'Limousine Car',
      amount: '$150',
      status: 'completed',
      duration: '3 hours'
    },
    {
      id: 2,
      date: '2024-06-12',
      car: 'Premium SUV',
      amount: '$200',
      status: 'completed',
      duration: '4 hours'
    },
    {
      id: 3,
      date: '2024-06-10',
      car: 'Economy Sedan',
      amount: '$75',
      status: 'completed',
      duration: '2 hours'
    },
    {
      id: 4,
      date: '2024-06-08',
      car: 'Luxury Sedan',
      amount: '$220',
      status: 'completed',
      duration: '5 hours'
    },
    {
      id: 5,
      date: '2024-06-05',
      car: 'Prestige Cars',
      amount: '$180',
      status: 'pending',
      duration: '3.5 hours'
    }
  ];

  const getMaxValue = () => {
    return Math.max(...monthlyData.map(d => Math.max(d.bookings, d.rides))) + 5;
  };

  const getBarHeight = (value) => {
    const maxValue = getMaxValue();
    return (value / maxValue) * 200;
  };

  return (
    <Layout>
      <div className="booking-analytics-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Booking Analytics</h1>
            <p>Track your booking history and statistics</p>
          </div>
          <div className="period-selector">
            <button
              className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button
              className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button
              className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat.id} className="stat-card card">
              <div className={`stat-icon stat-${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change">
                  <i className="fas fa-arrow-up"></i> {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="analytics-grid">
          {/* Chart Section */}
          <div className="chart-section card">
            <div className="section-header">
              <h3>Booking Trends</h3>
              <select className="period-select">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>All time</option>
              </select>
            </div>

            <div className="chart-container">
              <div className="chart">
                <div className="chart-bars">
                  {monthlyData.map((data, idx) => (
                    <div key={idx} className="bar-group">
                      <div className="bar-wrapper">
                        <div
                          className="bar bar-bookings"
                          style={{ height: `${getBarHeight(data.bookings)}px` }}
                          title={`${data.month}: ${data.bookings} bookings`}
                        >
                          <span className="bar-label">{data.bookings}</span>
                        </div>
                      </div>
                      <div className="bar-wrapper">
                        <div
                          className="bar bar-rides"
                          style={{ height: `${getBarHeight(data.rides)}px` }}
                          title={`${data.month}: ${data.rides} rides`}
                        >
                          <span className="bar-label">{data.rides}</span>
                        </div>
                      </div>
                      <span className="bar-month">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color bookings"></span> Bookings
                </span>
                <span className="legend-item">
                  <span className="legend-color rides"></span> Completed Rides
                </span>
              </div>
            </div>
          </div>

          {/* Booking Types */}
          <div className="booking-types-section card">
            <div className="section-header">
              <h3>Booking Types</h3>
            </div>

            <div className="types-list">
              {bookingTypes.map((type, idx) => (
                <div key={idx} className="type-item">
                  <div className="type-info">
                    <p className="type-name">{type.type}</p>
                    <p className="type-count">{type.count} bookings</p>
                  </div>
                  <div className="type-bar">
                    <div
                      className="type-bar-fill"
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <span className="type-percentage">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="recent-bookings-section card">
          <div className="section-header">
            <h3>Recent Bookings</h3>
            <a href="/customer/bookings" className="view-all-link">
              View All <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          <div className="table-responsive">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Car</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.date}</td>
                    <td>
                      <div className="car-cell">
                        <i className="fas fa-car"></i>
                        <span>{booking.car}</span>
                      </div>
                    </td>
                    <td>{booking.duration}</td>
                    <td className="amount">{booking.amount}</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingAnalytics;
