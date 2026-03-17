const express = require('express');
const {
  updateLocation,
  getLocation,
  updateAvailability,
  getAllDrivers
} = require('../controllers/driverController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Driver routes
router.post('/location', auth, authorize('driver'), updateLocation);
router.get('/location', auth, authorize('driver'), getLocation);
router.patch('/availability', auth, authorize('driver'), updateAvailability);

// Admin routes
router.get('/all', auth, authorize('admin'), getAllDrivers);

module.exports = router;