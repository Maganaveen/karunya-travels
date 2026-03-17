const User = require('../models/User');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const DriverLocation = require('../models/DriverLocation');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });
    
    if (role === 'driver') {
      // Get location data for drivers
      const driversWithLocation = await Promise.all(
        users.map(async (driver) => {
          const location = await DriverLocation.findOne({ driverId: driver._id });
          console.log(`Driver ${driver.name} location:`, location); // Debug log
          return {
            ...driver.toObject(),
            location: location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address,
              lastUpdated: location.lastUpdated
            } : null
          };
        })
      );
      console.log('Drivers with location:', driversWithLocation); // Debug log
      return res.json(driversWithLocation);
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    res.status(500).json({ message: error.message });
  }
};

// Deactivate/Activate user
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['assigned', 'started', 'in-progress'] } 
    });

    // Monthly bookings
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    // Revenue calculation
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    res.json({
      totalUsers,
      totalCustomers,
      totalDrivers,
      totalCars,
      totalBookings,
      activeBookings,
      monthlyBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking reports
const getBookingReports = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let dateFilter = {};
    const now = new Date();

    if (period === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: today } };
    } else if (period === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { createdAt: { $gte: monthStart } };
    }

    const bookings = await Booking.find(dateFilter)
      .populate('customerId', 'name email')
      .populate('driverId', 'name email')
      .populate('carId', 'name number')
      .sort({ createdAt: -1 });

    const totalAmount = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const revenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    res.json({
      period,
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalAmount,
      revenue,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUsersByRole,
  toggleUserStatus,
  getDashboardStats,
  getBookingReports
};