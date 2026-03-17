const User = require('../models/User');
const DriverLocation = require('../models/DriverLocation');

// Update driver location
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const location = await DriverLocation.findOneAndUpdate(
      { driverId: req.user.id },
      {
        latitude,
        longitude,
        address: address || '',
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Location updated successfully',
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver location
const getLocation = async (req, res) => {
  try {
    const location = await DriverLocation.findOne({ driverId: req.user.id });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability status
const updateAvailability = async (req, res) => {
  try {
    const { isAvailable, offlineReason } = req.body;

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      { isAvailable },
      { new: true }
    ).select('-password');

    const updateData = isAvailable
      ? { loginTime: new Date(), offlineReason: '' }
      : { offlineReason: offlineReason || '' };

    await DriverLocation.findOneAndUpdate(
      { driverId: req.user.id },
      updateData,
      { upsert: true }
    );

    res.json({
      message: `Driver ${isAvailable ? 'online' : 'offline'}`,
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all drivers (admin)
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' })
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('Found drivers:', drivers.length);

    // Get locations for each driver
    const driversWithLocation = await Promise.all(
      drivers.map(async (driver) => {
        const location = await DriverLocation.findOne({ driverId: driver._id });
        console.log(`Driver ${driver.name} (${driver._id}) location:`, location);
        const driverObj = driver.toObject();
        console.log(`Driver ${driver.name} isActive:`, driverObj.isActive, 'isAvailable:', driverObj.isAvailable);
        return {
          ...driverObj,
          location: location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
            lastUpdated: location.lastUpdated,
            offlineReason: location.offlineReason || '',
            updatedAt: location.updatedAt
          } : null
        };
      })
    );

    console.log('Drivers with location data:', driversWithLocation);
    res.json(driversWithLocation);
  } catch (error) {
    console.error('Error in getAllDrivers:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateLocation,
  getLocation,
  updateAvailability,
  getAllDrivers
};