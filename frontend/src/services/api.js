import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://karunya-travels.onrender.com/api';

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
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle auth errors
let isLoggingOut = false;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes('/auth/') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const token = localStorage.getItem('token');
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }
      if (!isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        setTimeout(() => { isLoggingOut = false; }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  uploadAvatar: (formData) => api.post('/auth/upload-avatar', formData),
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
  updateAvailability: (isAvailable, offlineReason) => api.patch('/drivers/availability', { isAvailable, offlineReason }),
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