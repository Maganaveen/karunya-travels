const mongoose = require('mongoose');
const Location = require('../models/Location');

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
      ['Cuddalore', [
        { name: 'Silver Beach', distance: 3, type: 'beach', coordinates: { lat: 11.7333, lng: 79.7833 } },
        { name: 'Pichavaram Mangrove Forest', distance: 16, type: 'nature', coordinates: { lat: 11.4167, lng: 79.7833 } },
        { name: 'Thiruvathigai Temple', distance: 12, type: 'temple', coordinates: { lat: 11.6500, lng: 79.6833 } },
        { name: 'Fort St. David', distance: 5, type: 'fort', coordinates: { lat: 11.7167, lng: 79.7667 } },
        { name: 'Pataleeswarar Temple', distance: 2, type: 'temple', coordinates: { lat: 11.7480, lng: 79.7714 } }
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
    cities: [
      'Thiruvananthapuram', 'Kollam', 'Alappuzha', 'Pathanamthitta', 'Kottayam',
      'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
      'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
    ],
    touristSpots: new Map([
      ['Thiruvananthapuram', [
        { name: 'Sree Padmanabhaswamy Temple', distance: 3, type: 'temple', coordinates: { lat: 8.4826, lng: 76.9437 } },
        { name: 'Kovalam Beach', distance: 16, type: 'beach', coordinates: { lat: 8.3988, lng: 76.9780 } },
        { name: 'Varkala Beach', distance: 51, type: 'beach', coordinates: { lat: 8.7379, lng: 76.7163 } },
        { name: 'Ponmudi', distance: 61, type: 'hill_station', coordinates: { lat: 8.7600, lng: 77.1100 } }
      ]],
      ['Kollam', [
        { name: 'Ashtamudi Lake', distance: 5, type: 'nature', coordinates: { lat: 8.9500, lng: 76.5800 } },
        { name: 'Jatayu Earths Center', distance: 62, type: 'attraction', coordinates: { lat: 8.8667, lng: 76.8833 } },
        { name: 'Munroe Island', distance: 27, type: 'nature', coordinates: { lat: 8.9833, lng: 76.5500 } }
      ]],
      ['Alappuzha', [
        { name: 'Alappuzha Beach', distance: 2, type: 'beach', coordinates: { lat: 9.4900, lng: 76.3160 } },
        { name: 'Backwaters', distance: 5, type: 'nature', coordinates: { lat: 9.5000, lng: 76.3500 } },
        { name: 'Kuttanad', distance: 16, type: 'nature', coordinates: { lat: 9.3500, lng: 76.4200 } },
        { name: 'Marari Beach', distance: 13, type: 'beach', coordinates: { lat: 9.5833, lng: 76.2833 } }
      ]],
      ['Pathanamthitta', [
        { name: 'Sabarimala Temple', distance: 72, type: 'temple', coordinates: { lat: 9.4361, lng: 77.0811 } },
        { name: 'Gavi', distance: 96, type: 'nature', coordinates: { lat: 9.4000, lng: 77.1500 } }
      ]],
      ['Kottayam', [
        { name: 'Kumarakom', distance: 16, type: 'nature', coordinates: { lat: 9.5922, lng: 76.4308 } },
        { name: 'Illikkal Kallu', distance: 58, type: 'nature', coordinates: { lat: 9.7833, lng: 76.8167 } }
      ]],
      ['Idukki', [
        { name: 'Munnar Tea Estates', distance: 50, type: 'nature', coordinates: { lat: 10.0889, lng: 77.0595 } },
        { name: 'Eravikulam National Park', distance: 60, type: 'park', coordinates: { lat: 10.2000, lng: 77.0333 } },
        { name: 'Periyar Wildlife Sanctuary (Thekkady)', distance: 80, type: 'park', coordinates: { lat: 9.4667, lng: 77.1667 } },
        { name: 'Vagamon', distance: 45, type: 'hill_station', coordinates: { lat: 9.6833, lng: 76.9000 } }
      ]],
      ['Ernakulam', [
        { name: 'Chinese Fishing Nets', distance: 15, type: 'heritage', coordinates: { lat: 9.9678, lng: 76.2430 } },
        { name: 'Fort Kochi', distance: 13, type: 'heritage', coordinates: { lat: 9.9650, lng: 76.2230 } },
        { name: 'Mattancherry Palace', distance: 14, type: 'palace', coordinates: { lat: 9.9312, lng: 76.2573 } }
      ]],
      ['Thrissur', [
        { name: 'Athirappilly Waterfalls', distance: 60, type: 'waterfall', coordinates: { lat: 10.2856, lng: 76.5697 } },
        { name: 'Guruvayur Temple', distance: 29, type: 'temple', coordinates: { lat: 10.5946, lng: 76.0407 } }
      ]],
      ['Palakkad', [
        { name: 'Silent Valley National Park', distance: 70, type: 'park', coordinates: { lat: 11.0833, lng: 76.4333 } },
        { name: 'Malampuzha Dam', distance: 12, type: 'dam', coordinates: { lat: 10.8333, lng: 76.6833 } }
      ]],
      ['Malappuram', [
        { name: 'Nilambur Teak Museum', distance: 45, type: 'museum', coordinates: { lat: 11.2833, lng: 76.2333 } }
      ]],
      ['Kozhikode', [
        { name: 'Kappad Beach', distance: 16, type: 'beach', coordinates: { lat: 11.3833, lng: 75.7167 } }
      ]],
      ['Wayanad', [
        { name: 'Edakkal Caves', distance: 25, type: 'heritage', coordinates: { lat: 11.6167, lng: 76.2167 } },
        { name: 'Banasura Sagar Dam', distance: 21, type: 'dam', coordinates: { lat: 11.6700, lng: 76.0400 } }
      ]],
      ['Kannur', [
        { name: 'Muzhappilangad Beach', distance: 15, type: 'beach', coordinates: { lat: 11.8167, lng: 75.3667 } },
        { name: 'St. Angelo Fort', distance: 3, type: 'fort', coordinates: { lat: 11.8667, lng: 75.3500 } }
      ]],
      ['Kasaragod', [
        { name: 'Bekal Fort', distance: 16, type: 'fort', coordinates: { lat: 12.3917, lng: 75.0333 } }
      ]]
    ])
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Tirupati', 'Visakhapatnam', 'Kurnool', 'Anantapur', 'YSR Kadapa', 'NTR (Vijayawada)', 'Alluri Sitharama Raju', 'Nellore', 'Guntur'],
    touristSpots: new Map([
      ['Tirupati', [
        { name: 'Tirumala Venkateswara Temple', distance: 22, type: 'temple', coordinates: { lat: 13.6833, lng: 79.3472 } },
        { name: 'Srikalahasteeswara Temple', distance: 36, type: 'temple', coordinates: { lat: 13.7500, lng: 79.6981 } },
        { name: 'Talakona Waterfalls', distance: 49, type: 'waterfall', coordinates: { lat: 13.6667, lng: 79.1167 } },
        { name: 'Nagalapuram', distance: 60, type: 'nature', coordinates: { lat: 13.5333, lng: 79.9000 } }
      ]],
      ['Visakhapatnam', [
        { name: 'RK Beach', distance: 3, type: 'beach', coordinates: { lat: 17.7160, lng: 83.3290 } },
        { name: 'Araku Valley', distance: 114, type: 'hill_station', coordinates: { lat: 18.3273, lng: 82.8756 } },
        { name: 'Borra Caves', distance: 92, type: 'attraction', coordinates: { lat: 18.2833, lng: 83.0333 } },
        { name: 'INS Kursura Submarine Museum', distance: 4, type: 'museum', coordinates: { lat: 17.7170, lng: 83.3300 } }
      ]],
      ['Kurnool', [
        { name: 'Srisailam (Mallikarjuna Swamy Temple)', distance: 178, type: 'temple', coordinates: { lat: 15.8513, lng: 78.8686 } },
        { name: 'Mantralayam', distance: 74, type: 'temple', coordinates: { lat: 15.9833, lng: 77.3833 } },
        { name: 'Belum Caves', distance: 106, type: 'attraction', coordinates: { lat: 15.1004, lng: 78.1067 } },
        { name: 'Yaganti (Sri Yagantiswamy Temple)', distance: 100, type: 'temple', coordinates: { lat: 15.5333, lng: 78.1333 } }
      ]],
      ['Anantapur', [
        { name: 'Lepakshi (Veerabhadra Temple)', distance: 105, type: 'temple', coordinates: { lat: 13.8044, lng: 77.6067 } },
        { name: 'Puttaparthi (Sathya Sai Baba Ashram)', distance: 83, type: 'spiritual', coordinates: { lat: 14.1653, lng: 77.8117 } }
      ]],
      ['YSR Kadapa', [
        { name: 'Gandikota (Grand Canyon of India)', distance: 77, type: 'fort', coordinates: { lat: 15.1753, lng: 78.2872 } },
        { name: 'Ameen Peer Dargah', distance: 5, type: 'temple', coordinates: { lat: 14.4674, lng: 78.8241 } }
      ]],
      ['NTR (Vijayawada)', [
        { name: 'Kanaka Durga Temple', distance: 4, type: 'temple', coordinates: { lat: 16.5175, lng: 80.6097 } },
        { name: 'Bhavani Island', distance: 6, type: 'nature', coordinates: { lat: 16.5200, lng: 80.5900 } },
        { name: 'Undavalli Caves', distance: 8, type: 'heritage', coordinates: { lat: 16.4833, lng: 80.5833 } }
      ]],
      ['Alluri Sitharama Raju', [
        { name: 'Lambasingi (Kashmir of Andhra Pradesh)', distance: 100, type: 'hill_station', coordinates: { lat: 17.9333, lng: 82.5500 } },
        { name: 'Maredumilli', distance: 95, type: 'nature', coordinates: { lat: 17.5833, lng: 81.7333 } }
      ]],
      ['Nellore', [
        { name: 'Mypad Beach', distance: 25, type: 'beach', coordinates: { lat: 14.3500, lng: 80.1500 } },
        { name: 'Pulicat Bird Sanctuary', distance: 60, type: 'nature', coordinates: { lat: 13.4167, lng: 80.3167 } },
        { name: 'Udayagiri Fort', distance: 80, type: 'fort', coordinates: { lat: 14.0167, lng: 79.3167 } }
      ]]
    ])
  }
];

async function seedDatabase() {
  try {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-rental-app';
    await mongoose.connect(uri);
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

module.exports = { Location, seedDatabase, seedData };a