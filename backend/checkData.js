const mongoose = require('mongoose');
const Location = require('./models/Location');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/car-rental-app');
    
    const tamilNadu = await Location.findOne({ state: 'Tamil Nadu' });
    
    if (tamilNadu) {
      const maduraiSpots = tamilNadu.touristSpots.get('Madurai');
      console.log('Madurai tourist spots count:', maduraiSpots ? maduraiSpots.length : 0);
      console.log('Madurai spots:', JSON.stringify(maduraiSpots, null, 2));
    } else {
      console.log('Tamil Nadu not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();
