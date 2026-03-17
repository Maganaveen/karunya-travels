const express = require('express');
const {
  getAllUsers,
  getUsersByRole,
  toggleUserStatus,
  getDashboardStats,
  getBookingReports
} = require('../controllers/adminController');
const { getAllDrivers } = require('../controllers/driverController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authorization
router.use(auth, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/driver', getAllDrivers); // Use driverController for drivers
router.get('/users/:role', getUsersByRole);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.get('/dashboard-stats', getDashboardStats);
router.get('/reports/bookings', getBookingReports);

module.exports = router;