// routes/visits.js
const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

// Record a visit
router.post('/', async (req, res) => {
  try {
    const newVisit = new Visit(req.body);
    const savedVisit = await newVisit.save();
    res.status(201).json(savedVisit);
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Get visit analytics
router.get('/analytics', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'month';
    
    // Calculate date range based on timeRange
    const endDate = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    // Count total visits
    const totalVisits = await Visit.countDocuments({
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Count conversions
    const conversions = await Visit.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      isConversion: true
    });
    
    // Calculate conversion rate
    const conversionRate = totalVisits > 0 ? 
      ((conversions / totalVisits) * 100).toFixed(1) : 0;
    
    res.json({
      totalVisits,
      conversions,
      conversionRate
    });
    
  } catch (err) {
    console.error('Error fetching visit analytics:', err);
    res.status(500).json({ error: 'Failed to fetch visit analytics' });
  }
});

module.exports = router;