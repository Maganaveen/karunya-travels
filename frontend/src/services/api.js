import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Cars API
export const carsAPI = {
  getAll: () => api.get('/cars'),
  getAllAdmin: () => api.get('/cars/admin/all'),
  getById: (id) => api.get(`/cars/${id}`),
  create: (carData) => api.post('/cars', carData),
  update: (id, carData) => api.put(`/cars/${id}`, carData),
  delete: (id) => api.delete(`/cars/${id}`),
  getAvailable: (params) => api.get('/cars/available', { params }),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getDriverBookings: () => api.get('/bookings/driver-bookings'),
  updateStatus: (bookingId, status) => api.patch(`/bookings/${bookingId}/status`, { status }),
  getAllBookings: () => api.get('/bookings/all'),
  assignDriver: (bookingId, driverId) => api.patch(`/bookings/${bookingId}/assign-driver`, { driverId }),
  sendOTP: (bookingData) => api.post('/bookings/send-otp', bookingData),
  createPreliminary: (bookingData) => api.post('/bookings/create-preliminary', bookingData),
  verifyOTP: (phone, otp) => api.post('/bookings/verify-otp', { phone, otp }),
};

// Drivers API
export const driversAPI = {
  updateLocation: (locationData) => api.post('/drivers/location', locationData),
  getLocation: () => api.get('/drivers/location'),
  updateAvailability: (isAvailable) => api.patch('/drivers/availability', { isAvailable }),
  getAllDrivers: () => api.get('/drivers/all'),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUsersByRole: (role) => api.get(`/admin/users/${role}`),
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getBookingReports: (period) => api.get(`/admin/reports/bookings?period=${period}`),
};

// Locations API
export const locationsAPI = {
  getTamilNaduData: () => api.get('/locations/tamilnadu-data'),
  getStates: () => api.get('/locations/states'),
  getCities: (state) => api.get(`/locations/cities/${state}`),
  getTouristSpots: (state, city) => api.get(`/locations/tourist-spots/${state}/${city}`),
};

// Payments API
export const paymentsAPI = {
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
  getPayment: (paymentId) => api.get(`/payments/${paymentId}`),
  getPaymentsByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

export default api;