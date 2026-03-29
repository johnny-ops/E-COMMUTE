const express = require('express');
const router = express.Router();
const { philippineTerminals } = require('../data/sampleTerminals');

// Get nearby terminals
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius = 2000 } = req.query;
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };
    
    const nearbyTerminals = philippineTerminals
      .map(terminal => ({
        ...terminal,
        distance: calculateDistance(lat, lng, terminal.latitude, terminal.longitude)
      }))
      .filter(terminal => terminal.distance <= radius / 1000)
      .sort((a, b) => a.distance - b.distance);
    
    res.json({
      success: true,
      terminals: nearbyTerminals,
      count: nearbyTerminals.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
