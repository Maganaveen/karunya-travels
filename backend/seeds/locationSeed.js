const mongoose = require('mongoose');

// Location Schema
const locationSchema = new mongoose.Schema({
  state: { type: String, required: true },
  cities: [{ type: String, required: true }],
  touristSpots: {
    type: Map,
    of: [{
      name: { type: String, required: true },
      distance: { type: Number, required: true },
      type: { type: String, default: 'temple' },
      coordinates: {
        lat: Number,
        lng: Number
      }
    }]
  }
});

const Location = mongoose.model('Location', locationSchema);

const seedData = [
  {
    state: 'Tamil Nadu',
    cities: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
      'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
      'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
      'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
      'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
      'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
      'Viluppuram', 'Virudhunagar'
    ],
    touristSpots: new Map([
      ['Chennai', [
        { name: 'Marina Beach', distance: 5, type: 'beach', coordinates: { lat: 13.0827, lng: 80.2707 } },
        { name: 'Kapaleeshwarar Temple', distance: 12, type: 'temple', coordinates: { lat: 13.0339, lng: 80.2619 } },
        { name: 'Fort St. George', distance: 8, type: 'fort', coordinates: { lat: 13.0827, lng: 80.2885 } },
        { name: 'Guindy National Park', distance: 14, type: 'park', coordinates: { lat: 13.0039, lng: 80.2372 } },
        { name: 'Mahabalipuram', distance: 58, type: 'heritage', coordinates: { lat: 12.6269, lng: 80.1927 } }
      ]],
      ['Coimbatore', [
        { name: 'Marudamalai Temple', distance: 15, type: 'temple', coordinates: { lat: 11.0468, lng: 76.9248 } },
        { name: 'Dhyanalinga', distance: 30, type: 'temple', coordinates: { lat: 10.9723, lng: 76.7405 } },
        { name: 'Siruvani Waterfalls', distance: 35, type: 'nature', coordinates: { lat: 10.9388, lng: 76.6874 } },
        { name: 'Black Thunder', distance: 40, type: 'theme_park', coordinates: { lat: 11.3129, lng: 76.9213 } }
      ]],
      ['Madurai', [
        { name: 'Meenakshi Amman Temple', distance: 3, type: 'temple', coordinates: { lat: 9.9195, lng: 78.1193 } },
        { name: 'Thirumalai Nayakkar Palace', distance: 5, type: 'palace', coordinates: { lat: 9.9152, lng: 78.1238 } },
        { name: 'Gandhi Memorial Museum', distance: 4, type: 'museum', coordinates: { lat: 9.9329, lng: 78.1425 } },
        { name: 'Vandiyur Mariamman Teppakulam', distance: 4, type: 'temple', coordinates: { lat: 9.9000, lng: 78.1300 } },
        { name: 'Koodal Azhagar Temple', distance: 1, type: 'temple', coordinates: { lat: 9.9200, lng: 78.1200 } },
        { name: 'St. Mary\'s Cathedral', distance: 2, type: 'church', coordinates: { lat: 9.9250, lng: 78.1250 } },
        { name: 'Thirupparankundram', distance: 8, type: 'temple', coordinates: { lat: 9.8700, lng: 78.0700 } },
        { name: 'Samanar Hills', distance: 10, type: 'historical', coordinates: { lat: 9.9500, lng: 78.0800 } },
        { name: 'Alagar Koyil', distance: 21, type: 'temple', coordinates: { lat: 10.0754, lng: 78.2163 } },
        { name: 'Pazhamudhir Solai', distance: 25, type: 'temple', coordinates: { lat: 10.0000, lng: 78.2000 } },
        { name: 'Kutladampatti Falls', distance: 30, type: 'waterfall', coordinates: { lat: 9.8500, lng: 78.0500 } },
        { name: 'Vaigai Dam', distance: 70, type: 'dam', coordinates: { lat: 10.0500, lng: 78.3000 } },
        { name: 'Kodaikanal', distance: 117, type: 'hill_station', coordinates: { lat: 10.2381, lng: 77.4892 } }
      ]],
      ['Tiruchirappalli', [
        { name: 'Rock Fort Temple', distance: 5, type: 'temple', coordinates: { lat: 10.8284, lng: 78.6976 } },
        { name: 'Sri Ranganathaswamy Temple', distance: 9, type: 'temple', coordinates: { lat: 10.8624, lng: 78.6918 } },
        { name: 'Jambukeswarar Temple', distance: 8, type: 'temple', coordinates: { lat: 10.8524, lng: 78.7056 } },
        { name: 'Kallanai Dam', distance: 20, type: 'dam', coordinates: { lat: 10.8359, lng: 78.8258 } }
      ]],
      ['Salem', [
        { name: 'Yercaud', distance: 30, type: 'nature', coordinates: { lat: 11.7753, lng: 78.2093 } },
        { name: 'Kiliyur Falls', distance: 33, type: 'waterfall', coordinates: { lat: 11.7942, lng: 78.2039 } },
        { name: 'Mettur Dam', distance: 50, type: 'dam', coordinates: { lat: 11.7997, lng: 77.8047 } },
        { name: '1008 Lingam Temple', distance: 12, type: 'temple', coordinates: { lat: 11.6643, lng: 78.1460 } }
      ]],
      ['Tirunelveli', [
        { name: 'Nellaiappar Temple', distance: 4, type: 'temple', coordinates: { lat: 8.7274, lng: 77.7027 } },
        { name: 'Agasthiyar Falls', distance: 45, type: 'waterfall', coordinates: { lat: 8.6478, lng: 77.3872 } },
        { name: 'Papanasam Dam', distance: 50, type: 'dam', coordinates: { lat: 8.6816, lng: 77.3621 } },
        { name: 'Manimuthar Dam', distance: 48, type: 'dam', coordinates: { lat: 8.6425, lng: 77.4247 } }
      ]],
      ['Erode', [
        { name: 'Bhavani Sagar Dam', distance: 80, type: 'dam', coordinates: { lat: 11.4704, lng: 77.0863 } },
        { name: 'Kodiveri Dam', distance: 45, type: 'dam', coordinates: { lat: 11.5167, lng: 77.2917 } },
        { name: 'Chennimalai Murugan Temple', distance: 30, type: 'temple', coordinates: { lat: 11.1667, lng: 77.6000 } },
        { name: 'Vellode Bird Sanctuary', distance: 15, type: 'nature', coordinates: { lat: 11.2333, lng: 77.6833 } }
      ]],
      ['Vellore', [
        { name: 'Vellore Fort', distance: 2, type: 'fort', coordinates: { lat: 12.9165, lng: 79.1325 } },
        { name: 'Jalakandeswarar Temple', distance: 2, type: 'temple', coordinates: { lat: 12.9160, lng: 79.1320 } },
        { name: 'Sripuram Golden Temple', distance: 8, type: 'temple', coordinates: { lat: 12.8722, lng: 79.0861 } },
        { name: 'Amirthi Zoological Park', distance: 25, type: 'zoo', coordinates: { lat: 12.6833, lng: 79.0667 } }
      ]],
      ['Thoothukudi', [
        { name: 'Thiruchendur Murugan Temple', distance: 40, type: 'temple', coordinates: { lat: 8.4950, lng: 78.1228 } },
        { name: 'Our Lady of Snows Basilica', distance: 2, type: 'church', coordinates: { lat: 8.8028, lng: 78.1583 } },
        { name: 'Hare Island', distance: 10, type: 'beach', coordinates: { lat: 8.7833, lng: 78.1833 } }
      ]],
      ['Dindigul', [
        { name: 'Dindigul Rock Fort', distance: 2, type: 'fort', coordinates: { lat: 10.3667, lng: 77.9667 } },
        { name: 'Kodaikanal', distance: 95, type: 'hill_station', coordinates: { lat: 10.2381, lng: 77.4892 } },
        { name: 'Sirumalai', distance: 25, type: 'hill_station', coordinates: { lat: 10.2000, lng: 78.0000 } }
      ]],
      ['Thanjavur', [
        { name: 'Brihadeeswarar Temple', distance: 1, type: 'temple', coordinates: { lat: 10.7828, lng: 79.1318 } },
        { name: 'Thanjavur Maratha Palace', distance: 2, type: 'palace', coordinates: { lat: 10.7967, lng: 79.1367 } },
        { name: 'Gangaikonda Cholapuram', distance: 70, type: 'temple', coordinates: { lat: 11.2056, lng: 79.4497 } }
      ]],
      ['Kanchipuram', [
        { name: 'Kamakshi Amman Temple', distance: 1, type: 'temple', coordinates: { lat: 12.8406, lng: 79.7036 } },
        { name: 'Ekambareswarar Temple', distance: 2, type: 'temple', coordinates: { lat: 12.8475, lng: 79.6997 } },
        { name: 'Varadharaja Perumal Temple', distance: 4, type: 'temple', coordinates: { lat: 12.8192, lng: 79.7233 } },
        { name: 'Vedanthangal Bird Sanctuary', distance: 48, type: 'nature', coordinates: { lat: 12.5444, lng: 79.8556 } }
      ]],
      ['Kanyakumari', [
        { name: 'Vivekananda Rock Memorial', distance: 1, type: 'memorial', coordinates: { lat: 8.0780, lng: 77.5550 } },
        { name: 'Thiruvalluvar Statue', distance: 1, type: 'statue', coordinates: { lat: 8.0780, lng: 77.5555 } },
        { name: 'Kanyakumari Beach', distance: 0.5, type: 'beach', coordinates: { lat: 8.0810, lng: 77.5505 } },
        { name: 'Suchindram Temple', distance: 13, type: 'temple', coordinates: { lat: 8.1560, lng: 77.4640 } }
      ]],
      ['Nilgiris', [
        { name: 'Ooty Botanical Gardens', distance: 2, type: 'garden', coordinates: { lat: 11.4172, lng: 76.7111 } },
        { name: 'Doddabetta Peak', distance: 9, type: 'nature', coordinates: { lat: 11.4010, lng: 76.7350 } },
        { name: 'Pykara Lake', distance: 20, type: 'lake', coordinates: { lat: 11.4422, lng: 76.5986 } },
        { name: 'Sim\'s Park (Coonoor)', distance: 20, type: 'park', coordinates: { lat: 11.3530, lng: 76.8020 } }
      ]],
      ['Ramanathapuram', [
        { name: 'Ramanathaswamy Temple (Rameswaram)', distance: 55, type: 'temple', coordinates: { lat: 9.2881, lng: 79.3174 } },
        { name: 'Dhanushkodi', distance: 75, type: 'beach', coordinates: { lat: 9.1760, lng: 79.4140 } },
        { name: 'Pamban Bridge', distance: 45, type: 'bridge', coordinates: { lat: 9.2780, lng: 79.2070 } }
      ]]
    ])
  },
  {
    state: 'Kerala',
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Munnar', 'Alappuzha', 'Wayanad'],
    touristSpots: new Map([
      ['Kochi', [
        { name: 'Chinese Fishing Nets', distance: 3, type: 'heritage', coordinates: { lat: 9.9312, lng: 76.2673 } },
        { name: 'Fort Kochi', distance: 4, type: 'heritage', coordinates: { lat: 9.9650, lng: 76.2230 } },
        { name: 'Mattancherry Palace', distance: 8, type: 'palace', coordinates: { lat: 9.9312, lng: 76.2573 } }
      ]],
      ['Munnar', [
        { name: 'Tea Gardens', distance: 5, type: 'nature', coordinates: { lat: 10.0889, lng: 77.0595 } },
        { name: 'Mattupetty Dam', distance: 13, type: 'dam', coordinates: { lat: 10.1060, lng: 77.1230 } },
        { name: 'Eravikulam National Park', distance: 8, type: 'park', coordinates: { lat: 10.2000, lng: 77.0333 } }
      ]],
      ['Alappuzha', [
        { name: 'Alappuzha Beach', distance: 2, type: 'beach', coordinates: { lat: 9.4900, lng: 76.3160 } },
        { name: 'Backwaters', distance: 5, type: 'nature', coordinates: { lat: 9.5000, lng: 76.3500 } }
      ]]
    ])
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kadapa', 'Kurnool', 'Nellore'],
    touristSpots: new Map([
      ['Tirupati', [
        { name: 'Tirumala Temple', distance: 22, type: 'temple', coordinates: { lat: 13.6288, lng: 79.4192 } },
        { name: 'Kapila Theertham', distance: 4, type: 'waterfall', coordinates: { lat: 13.6550, lng: 79.4200 } },
        { name: 'Chandragiri Fort', distance: 15, type: 'fort', coordinates: { lat: 13.5888, lng: 79.3192 } }
      ]],
      ['Visakhapatnam', [
        { name: 'RK Beach', distance: 3, type: 'beach', coordinates: { lat: 17.7160, lng: 83.3290 } },
        { name: 'Kailasagiri', distance: 10, type: 'park', coordinates: { lat: 17.7500, lng: 83.3400 } },
        { name: 'Submarine Museum', distance: 4, type: 'museum', coordinates: { lat: 17.7170, lng: 83.3300 } }
      ]]
    ])
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/car-rental-app');
    await Location.deleteMany({});
    await Location.insertMany(seedData);
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { Location, seedDatabase, seedData };