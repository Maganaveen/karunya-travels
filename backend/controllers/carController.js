const Car = require('../models/Car');

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cars (admin - including unavailable)
const getAllCarsAdmin = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create car (admin)
const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({
      message: 'Car created successfully',
      car
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Car number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update car (admin)
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({
      message: 'Car updated successfully',
      car
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available cars (with date logic placeholder)
const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // For now, return all cars that are marked as available in the generic sense
    // In a real app, we would check against existing bookings for the date range
    const cars = await Car.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete car (admin)
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCars,
  getAllCarsAdmin,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getAvailableCars
};