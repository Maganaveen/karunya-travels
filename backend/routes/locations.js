const express = require('express');
const axios = require('axios');
const District = require('../models/District');
const TouristSpot = require('../models/TouristSpot');
const Location = require('../models/Location');
const router = express.Router();

// Get all districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await District.find({}).select('name -_id');
    res.json(districts.map(d => d.name));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching districts' });
  }
});

// Get tourist spots by district
router.get('/tourist-spots/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const location = await Location.findOne({ state: 'Tamil Nadu' });
    if (!location) {
      return res.status(404).json({ message: 'Location data not found' });
    }
    const spots = location.touristSpots.get(district) || [];
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tourist spots' });
  }
});

// Get all tourist spots
router.get('/tourist-spots', async (req, res) => {
  try {
    const spots = await TouristSpot.find({}).select('name district distance type -_id');
    const groupedSpots = spots.reduce((acc, spot) => {
      if (!acc[spot.district]) acc[spot.district] = [];
      acc[spot.district].push({ name: spot.name, distance: spot.distance, type: spot.type });
      return acc;
    }, {});
    res.json(groupedSpots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tourist spots' });
  }
});

// Get all states
router.get('/states', async (req, res) => {
  try {
    const states = await Location.find({}, 'state').distinct('state');
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get cities by state
router.get('/cities/:state', async (req, res) => {
  try {
    const location = await Location.findOne({ state: req.params.state });
    if (!location) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }
    res.json({ success: true, data: location.cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get tourist spots by city
router.get('/tourist-spots/:state/:city', async (req, res) => {
  try {
    const location = await Location.findOne({ state: req.params.state });
    if (!location) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    const spots = location.touristSpots.get(req.params.city) || [];
    res.json({ success: true, data: spots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate distance using Google Maps API
router.post('/calculate-distance', async (req, res) => {
  try {
    const { origins, destinations } = req.body;
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key not configured'
      });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        units: 'metric',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const distances = response.data.rows.map(row =>
        row.elements.map(element => ({
          distance: element.distance ? element.distance.value / 1000 : null, // Convert to km
          duration: element.duration ? element.duration.value / 60 : null, // Convert to minutes
          status: element.status
        }))
      );

      res.json({ success: true, data: distances });
    } else {
      res.status(400).json({
        success: false,
        message: 'Google Maps API error: ' + response.data.status
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate journey route with multiple stops using OSRM (free alternative)
router.post('/calculate-journey', async (req, res) => {
  try {
    console.log('Calculate Journey Request:', req.body);
    const { homeCity, visitCities, touristSpots } = req.body;

    // Predefined coordinates for Tamil Nadu locations (you can expand this)
    const locationCoords = {
      'Cuddalore': [11.7480, 79.7714],
      'Chennai': [13.0827, 80.2707],
      'Madurai': [9.9252, 78.1198],
      'Coimbatore': [11.0168, 76.9558],
      'Tiruchirappalli': [10.7905, 78.7047],
      'Salem': [11.6643, 78.1460],
      'Tirunelveli': [8.7139, 77.7567],
      'Thoothukudi': [8.7642, 78.1348],
      'Vellore': [12.9165, 79.1325],
      'Erode': [11.3410, 77.7172],
      'Thanjavur': [10.7870, 79.1378],
      'Dindigul': [10.3673, 77.9803],
      'Kanchipuram': [12.8342, 79.7036],
      'Thiruchendur': [8.4958, 78.1201],
      'Rameswaram': [9.2876, 79.3129],
      'Kanyakumari': [8.0883, 77.5385],
      'Ooty': [11.4102, 76.6950],
      'Kodaikanal': [10.2381, 77.4892]
    };

    // Build complete route including tourist spots
    const routePoints = [];
    const routeLabels = [homeCity];
    
    // Add home city
    if (locationCoords[homeCity]) {
      routePoints.push(locationCoords[homeCity]);
    }
    
    visitCities.forEach(city => {
      if (touristSpots && touristSpots[city] && touristSpots[city].length > 0) {
        touristSpots[city].forEach(spot => {
          const spotName = spot.name;
          if (locationCoords[spotName]) {
            routePoints.push(locationCoords[spotName]);
            routeLabels.push(`${spotName} (${city})`);
          } else if (locationCoords[city]) {
            routePoints.push(locationCoords[city]);
            routeLabels.push(city);
          }
        });
      } else if (locationCoords[city]) {
        routePoints.push(locationCoords[city]);
        routeLabels.push(city);
      }
    });

    if (routePoints.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Unable to find coordinates for selected locations' 
      });
    }

    // Use OSRM for routing (free and open source)
    const segments = [];
    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 0; i < routePoints.length - 1; i++) {
      const [lat1, lon1] = routePoints[i];
      const [lat2, lon2] = routePoints[i + 1];
      
      try {
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
        const response = await axios.get(osrmUrl);
        
        if (response.data.code === 'Ok' && response.data.routes.length > 0) {
          const route = response.data.routes[0];
          const segmentDistance = route.distance / 1000; // Convert to km
          const segmentTime = route.duration / 60; // Convert to minutes
          
          totalDistance += segmentDistance;
          totalTime += segmentTime;
          
          segments.push({
            from: routeLabels[i],
            to: routeLabels[i + 1],
            distance: Math.round(segmentDistance),
            time: Math.round(segmentTime)
          });
        }
      } catch (error) {
        console.error(`Error calculating route segment ${i}:`, error.message);
        // Fallback: use straight-line distance approximation
        const distance = calculateHaversineDistance(routePoints[i], routePoints[i + 1]);
        totalDistance += distance;
        totalTime += (distance / 60); // Assume 60 km/h
        
        segments.push({
          from: routeLabels[i],
          to: routeLabels[i + 1],
          distance: Math.round(distance),
          time: Math.round(distance / 60 * 60)
        });
      }
    }

    res.json({
      success: true,
      data: {
        totalDistance: Math.round(totalDistance),
        totalTime: Math.round(totalTime),
        route: [homeCity, ...visitCities],
        segments
      }
    });
  } catch (error) {
    console.error('Journey calculation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateHaversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get Tamil Nadu specific data
router.get('/tamilnadu-data', async (req, res) => {
  try {
    const tamilNadu = await Location.findOne({ state: 'Tamil Nadu' });

    if (!tamilNadu) {
      return res.status(404).json({ success: false, message: 'Tamil Nadu data not found' });
    }

    // Convert Map to object for frontend
    const touristSpotsObj = {};
    if (tamilNadu.touristSpots) {
      tamilNadu.touristSpots.forEach((spots, district) => {
        touristSpotsObj[district] = spots;
      });
    }

    res.json({
      success: true,
      data: {
        districts: tamilNadu.cities,
        touristSpots: touristSpotsObj
      }
    });

  } catch (error) {
    console.error('Error fetching TN data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;