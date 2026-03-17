const mongoose = require('mongoose');

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
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
