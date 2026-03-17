const mongoose = require('mongoose');
const Location = require('./models/Location');

async function fixDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/car-rental-app');
    
    // Find all Tamil Nadu documents
    const allTN = await Location.find({ state: 'Tamil Nadu' });
    console.log(`Found ${allTN.length} Tamil Nadu documents`);
    
    // Delete all Tamil Nadu documents
    await Location.deleteMany({ state: 'Tamil Nadu' });
    console.log('Deleted all Tamil Nadu documents');
    
    // Reseed
    const { seedData } = require('./seeds/locationSeed');
    await Location.insertMany(seedData);
    console.log('✅ Reseeded with fresh data');
    
    // Verify
    const tamilNadu = await Location.findOne({ state: 'Tamil Nadu' });
    const maduraiSpots = tamilNadu.touristSpots.get('Madurai');
    console.log(`Madurai now has ${maduraiSpots.length} spots`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDatabase();
