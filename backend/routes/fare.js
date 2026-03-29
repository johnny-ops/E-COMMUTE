const express = require('express');
const router = express.Router();

// Calculate fare for a route
router.post('/', async (req, res) => {
  try {
    const { distance, transportType, steps } = req.body;
    
    const fareRates = {
      jeepney: { base: 13, perKm: 1.5 },
      bus: { base: 15, perKm: 2 },
      train: { base: 15, perKm: 1 },
      tricycle: { base: 20, perKm: 5 },
    };
    
    let totalFare = 0;
    
    if (steps && steps.length > 0) {
      steps.forEach(step => {
        const rate = fareRates[step.type] || fareRates.jeepney;
        totalFare += rate.base + (step.distance * rate.perKm);
      });
    } else {
      const rate = fareRates[transportType] || fareRates.jeepney;
      totalFare = rate.base + (distance * rate.perKm);
    }
    
    res.json({
      success: true,
      totalFare: Math.round(totalFare * 100) / 100,
      breakdown: steps?.map(step => {
        const rate = fareRates[step.type] || fareRates.jeepney;
        return {
          type: step.type,
          fare: Math.round((rate.base + (step.distance * rate.perKm)) * 100) / 100
        };
      })
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
