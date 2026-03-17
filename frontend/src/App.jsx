import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page
import CustomerLanding from './pages/CustomerLanding';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import StartJourney from './pages/customer/StartJourney';
import CarList from './pages/customer/CarList';
import AvailableCars from './pages/customer/AvailableCars';
import BookCar from './pages/customer/BookCar';
import BookingDetails from './pages/customer/BookingDetails';
import BookingAnalytics from './pages/customer/BookingAnalytics';
import CustomerBookings from './pages/customer/CustomerBookings';

// General Pages
import Rentals from './pages/Rentals';
import Conditions from './pages/Conditions';
import AboutUs from './pages/AboutUs';
import AvailableCarsPublic from './pages/AvailableCarsPublic';
import Profile from './pages/Profile';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverBookings from './pages/driver/DriverBookings';
import DriverLocation from './pages/driver/DriverLocation';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CustomerLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/available-cars" element={<AvailableCarsPublic />} />
      <Route path="/start-journey" element={<StartJourney />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/conditions" element={<Conditions />} />
      <Route path="/about-us" element={<AboutUs />} />

      {/* Profile Route (all authenticated roles) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['customer', 'driver', 'admin']}>
            <Profile />
          </ProtectedRoute>
        }
      />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/cars"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CarList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/available-cars"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <AvailableCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/book/:carId"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/booking-details"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/analytics"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookingAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/bookings"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/location"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverLocation />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cars"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route
              path="/unauthorized"
              element={
                <div className="container">
                  <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#ff416c', marginBottom: '20px' }}></i>
                    <h2>Unauthorized Access</h2>
                    <p>You don't have permission to access this page.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="container">
                  <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <i className="fas fa-search" style={{ fontSize: '4rem', color: '#667eea', marginBottom: '20px' }}></i>
                    <h2>Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </div>
              }
            />
          </Routes>
        );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;