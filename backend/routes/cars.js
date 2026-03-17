const express = require('express');
const {
  getAllCars,
  getAllCarsAdmin,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getAvailableCars
} = require('../controllers/carController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/available', getAvailableCars);
router.get('/:id', getCarById);

// Admin routes
router.get('/admin/all', auth, authorize('admin'), getAllCarsAdmin);
router.post('/', auth, authorize('admin'), createCar);
router.put('/:id', auth, authorize('admin'), updateCar);
router.delete('/:id', auth, authorize('admin'), deleteCar);

module.exports = router;