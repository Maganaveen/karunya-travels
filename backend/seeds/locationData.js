const mongoose = require('mongoose');
const District = require('../models/District');
const TouristSpot = require('../models/TouristSpot');

const districts = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar'
];

const touristSpots = {
  'Chennai': [
    { name: 'Marina Beach', distance: 5, type: 'Beach' },
    { name: 'Kapaleeshwarar Temple', distance: 3, type: 'Temple' },
    { name: 'Fort St. George', distance: 4, type: 'Historical' },
    { name: 'Government Museum', distance: 6, type: 'Museum' },
    { name: 'Guindy National Park', distance: 10, type: 'Nature' }
  ],
  'Coimbatore': [
    { name: 'Marudhamalai Temple', distance: 15, type: 'Temple' },
    { name: 'Isha Yoga Center', distance: 30, type: 'Spiritual' },
    { name: 'Siruvani Waterfalls', distance: 35, type: 'Nature' },
    { name: 'Black Thunder', distance: 40, type: 'Theme Park' }
  ],
  'Madurai': [
    { name: 'Sri Meenakshi Amman Temple', distance: 0, type: 'Temple' },
    { name: 'Thirumalai Nayak Palace', distance: 1, type: 'Historical' },
    { name: 'Gandhi Memorial Museum', distance: 3, type: 'Museum' },
    { name: 'Vandiyur Mariamman Teppakulam', distance: 4, type: 'Temple' },
    { name: 'Koodal Azhagar Temple', distance: 1, type: 'Temple' },
    { name: 'St. Mary\'s Cathedral', distance: 2, type: 'Church' },
    { name: 'Thirupparankundram', distance: 8, type: 'Temple' },
    { name: 'Samanar Hills', distance: 10, type: 'Historical' },
    { name: 'Alagar Kovil', distance: 21, type: 'Temple' },
    { name: 'Pazhamudhir Solai', distance: 25, type: 'Temple' },
    { name: 'Kutladampatti Falls', distance: 30, type: 'Nature' },
    { name: 'Vaigai Dam', distance: 70, type: 'Nature' },
    { name: 'Kodaikanal', distance: 117, type: 'Hill Station' }
  ],
  'Kanyakumari': [
    { name: 'Vivekananda Rock Memorial', distance: 2, type: 'Memorial' },
    { name: 'Thiruvalluvar Statue', distance: 2, type: 'Monument' },
    { name: 'Kanyakumari Beach', distance: 1, type: 'Beach' },
    { name: 'Padmanabhapuram Palace', distance: 35, type: 'Historical' }
  ]
};

const seedData = async () => {
  try {
    await District.deleteMany({});
    await TouristSpot.deleteMany({});

    const districtDocs = districts.map(name => ({ name }));
    await District.insertMany(districtDocs);

    const spotDocs = [];
    Object.entries(touristSpots).forEach(([district, spots]) => {
      spots.forEach(spot => {
        spotDocs.push({ ...spot, district });
      });
    });
    await TouristSpot.insertMany(spotDocs);

    console.log('Location data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedData };