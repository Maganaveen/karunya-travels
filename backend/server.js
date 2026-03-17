const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const bookingRoutes = require('./routes/bookings');
const driverRoutes = require('./routes/drivers');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/locations');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend public directory
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Car Rental API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Create default admin user
    createDefaultAdmin();

    // Create sample data
    createSampleData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@carrental.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@carrental.com',
        password: 'admin123',
        phone: '1234567890',
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Create sample data
const createSampleData = async () => {
  try {
    const Car = require('./models/Car');
    const { Location, seedData } = require('./seeds/locationSeed');

    // Seed cars
    // Seed cars
    await Car.deleteMany({});

    const sampleCars = [
      // Small Cars
      {
        name: 'Maruti Suzuki Alto',
        number: 'TN01CA0001',
        model: '2023',
        pricePerKm: 6,
        capacity: 4,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/alto.jpg'
      },
      {
        name: 'Maruti Suzuki WagonR',
        number: 'TN01CA0002',
        model: '2023',
        pricePerKm: 7,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/wagonr.jpg'
      },
      {
        name: 'Maruti Suzuki Celerio',
        number: 'TN01CA0003',
        model: '2023',
        pricePerKm: 7,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/celerio.jpg'
      },
      {
        name: 'Hyundai Santro',
        number: 'TN01CA0004',
        model: '2022',
        pricePerKm: 7,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/santro.jpg'
      },
      {
        name: 'Hyundai Grand i10',
        number: 'TN01CA0005',
        model: '2023',
        pricePerKm: 8,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/grandi10.jpg'
      },
      {
        name: 'Tata Tiago',
        number: 'TN01CA0006',
        model: '2023',
        pricePerKm: 8,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/tiago.jpg'
      },
      {
        name: 'Renault Kwid',
        number: 'TN01CA0007',
        model: '2023',
        pricePerKm: 6,
        capacity: 5,
        fuelType: 'petrol',
        category: 'Small Car',
        description: 'Used for: city travel, short trips, self-drive rentals',
        image: 'http://localhost:5000/public/images/kwid.jpg'
      },

      // SUV / MUV
      {
        name: 'Toyota Innova',
        number: 'TN01CA0008',
        model: '2022',
        pricePerKm: 15,
        capacity: 7,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/innova.jpg'
      },
      {
        name: 'Toyota Innova Crysta',
        number: 'TN01CA0009',
        model: '2023',
        pricePerKm: 18,
        capacity: 7,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/crysta.jpg'
      },
      {
        name: 'Maruti Suzuki Ertiga',
        number: 'TN01CA0010',
        model: '2023',
        pricePerKm: 14,
        capacity: 7,
        fuelType: 'petrol',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/ertiga.jpg'
      },
      {
        name: 'Mahindra XUV300',
        number: 'TN01CA0011',
        model: '2023',
        pricePerKm: 13,
        capacity: 5,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/xuv300.jpg'
      },
      {
        name: 'Mahindra XUV500',
        number: 'TN01CA0012',
        model: '2021',
        pricePerKm: 15,
        capacity: 7,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/xuv500.jpg'
      },
      {
        name: 'Kia Carens',
        number: 'TN01CA0013',
        model: '2023',
        pricePerKm: 14,
        capacity: 7,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/carens.jpg'
      },
      {
        name: 'Tata Nexon',
        number: 'TN01CA0014',
        model: '2023',
        pricePerKm: 12,
        capacity: 5,
        fuelType: 'petrol',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/nexon.jpg'
      },
      {
        name: 'Hyundai Creta',
        number: 'TN01CA0015',
        model: '2023',
        pricePerKm: 14,
        capacity: 5,
        fuelType: 'diesel',
        category: 'SUV / MUV',
        description: 'Used for: family trips, temple tours, tourist packages',
        image: 'http://localhost:5000/public/images/creta.jpg'
      }
    ];

    await Car.insertMany(sampleCars);
    console.log('Sample cars reset and seeded successfully');

    // Seed locations
    const locationCount = await Location.countDocuments();
    if (locationCount === 0) {
      await Location.insertMany(seedData);
      console.log('Sample locations created');
    }
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});