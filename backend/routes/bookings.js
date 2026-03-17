const express = require('express');
const {
  createBooking,
  getUserBookings,
  getDriverBookings,
  updateBookingStatus,
  getAllBookings,
  assignDriver,
  sendOTP,
  verifyOTP,
  createPreliminaryBooking
} = require('../controllers/bookingController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public/Shared routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/create-preliminary', createPreliminaryBooking);

// Customer routes
router.post('/', auth, authorize('customer'), createBooking);
router.get('/my-bookings', auth, authorize('customer'), getUserBookings);

// Driver routes
router.get('/driver-bookings', auth, authorize('driver'), getDriverBookings);
router.patch('/:bookingId/status', auth, authorize('driver'), updateBookingStatus);

// Admin routes
router.get('/all', auth, authorize('admin'), getAllBookings);
router.patch('/:bookingId/assign-driver', auth, authorize('admin'), assignDriver);

module.exports = router;