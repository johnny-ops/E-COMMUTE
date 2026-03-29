const express = require('express');
const router = express.Router();

// In-memory storage (use database in production)
let reports = [
  {
    id: '1',
    type: 'traffic',
    location: 'EDSA-Cubao',
    description: 'Heavy traffic due to road construction',
    upvotes: 15,
    downvotes: 2,
    reliability: 88,
    timeAgo: '5 mins ago',
    timestamp: Date.now()
  },
  {
    id: '2',
    type: 'route_change',
    location: 'Divisoria Terminal',
    description: 'Jeepney route to Quiapo temporarily changed',
    upvotes: 8,
    downvotes: 1,
    reliability: 89,
    timeAgo: '15 mins ago',
    timestamp: Date.now() - 900000
  }
];

// Get all reports
router.get('/', (req, res) => {
  try {
    const sortedReports = reports.sort((a, b) => b.timestamp - a.timestamp);
    res.json({ success: true, reports: sortedReports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit new report
router.post('/', (req, res) => {
  try {
    const { type, location, description } = req.body;
    
    const newReport = {
      id: Date.now().toString(),
      type,
      location,
      description,
      upvotes: 0,
      downvotes: 0,
      reliability: 50,
      timeAgo: 'Just now',
      timestamp: Date.now()
    };
    
    reports.push(newReport);
    
    res.json({ success: true, report: newReport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vote on report
router.post('/:id/vote', (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    
    const report = reports.find(r => r.id === id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    if (vote === 'up') {
      report.upvotes++;
    } else if (vote === 'down') {
      report.downvotes++;
    }
    
    // Calculate reliability
    const totalVotes = report.upvotes + report.downvotes;
    report.reliability = totalVotes > 0 
      ? Math.round((report.upvotes / totalVotes) * 100) 
      : 50;
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
