const mongoose = require('mongoose');

const touristSpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'Tourist Spot'
  }
}, {
  timestamps: true
});

touristSpotSchema.index({ district: 1 });

module.exports = mongoose.model('TouristSpot', touristSpotSchema);