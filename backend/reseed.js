const mongoose = require('mongoose');
const { seedDatabase } = require('./seeds/locationSeed');

async function reseed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/car-rental-app');
    console.log('Connected!');
    
    console.log('Dropping locations collection...');
    await mongoose.connection.db.collection('locations').drop().catch(() => console.log('Collection does not exist, creating new...'));
    
    console.log('Reseeding database...');
    await seedDatabase();
    
    console.log('✅ Reseed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reseed error:', error);
    process.exit(1);
  }
}

reseed();
