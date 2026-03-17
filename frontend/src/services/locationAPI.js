import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://karunya-travels-2.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const locationAPI = {
  // Get all states
  getStates: () => api.get('/locations/states'),
  
  // Get cities by state
  getCities: (state) => api.get(`/locations/cities/${state}`),
  
  // Get Tamil Nadu data (districts and tourist spots)
  getTamilNaduData: () => api.get('/locations/tamilnadu-data'),
  
  // Get state data (districts and tourist spots) for any state
  getStateData: (state) => api.get(`/locations/state-data/${state}`),
  
  // Get tourist spots by city
  getTouristSpots: (state, city) => api.get(`/locations/tourist-spots/${state}/${city}`),
  
  // Calculate distance between cities
  calculateDistance: (origins, destinations) => 
    api.post('/locations/calculate-distance', { origins, destinations }),
  
  // Calculate complete journey
  calculateJourney: (homeCity, visitCities, touristSpots) =>
    api.post('/locations/calculate-journey', { homeCity, visitCities, touristSpots })
};

export default locationAPI;