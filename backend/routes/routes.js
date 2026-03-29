const express = require('express');
const router = express.Router();
const { philippineRoutes } = require('../data/sampleRoutes');

// Find routes between origin and destination
router.post('/', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    // In production, this would query a database and use real routing algorithms
    // For now, return sample routes
    const routes = philippineRoutes.filter(route => 
      route.origin.toLowerCase().includes(origin.toLowerCase()) ||
      route.destination.toLowerCase().includes(destination.toLowerCase())
    );
    
    res.json({
      success: true,
      routes: routes.length > 0 ? routes : philippineRoutes.slice(0, 3),
      origin,
      destination
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
