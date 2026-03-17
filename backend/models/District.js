const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state: {
    type: String,
    default: 'Tamil Nadu'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('District', districtSchema);