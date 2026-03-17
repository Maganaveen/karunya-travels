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
const parseCarForm = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/available', getAvailableCars);
router.get('/:id', getCarById);

// Admin routes
router.get('/admin/all', auth, authorize('admin'), getAllCarsAdmin);
router.post('/', auth, authorize('admin'), parseCarForm, createCar);
router.put('/:id', auth, authorize('admin'), parseCarForm, updateCar);
router.delete('/:id', auth, authorize('admin'), deleteCar);

module.exports = router;