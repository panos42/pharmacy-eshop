// routes/analytics.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
// You'll need to create these models
const Order = require('../models/Order');
const Visit = require('../models/Visit');

// Get customer analytics data
router.get('/', async (req, res) => {
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
    
    // Get total visitors
    const totalVisitors = await Visit.countDocuments({
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Get total orders
    const totalOrders = await Order.countDocuments({
      orderDate: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate conversion rate
    const conversionRate = totalVisitors > 0 ? 
      ((totalOrders / totalVisitors) * 100).toFixed(1) + '%' : '0%';
    
    // Calculate average order value
    const orderAggregate = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, average: { $avg: "$total" } } }
    ]);
    const averageOrderValue = orderAggregate.length > 0 ? 
      '€' + orderAggregate[0].average.toFixed(2) : '€0.00';
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", sales: { $sum: "$items.quantity" } } },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: { _id: 1, name: "$product.name", sales: 1 } }
    ]);
    
    // Get customer segments
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    const totalCustomers = await User.countDocuments();
    const returningCustomers = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "total" }
    ]);
    
    const returningCount = returningCustomers.length > 0 ? returningCustomers[0].total : 0;
    const oneTimeCount = totalCustomers - returningCount - newCustomers;
    
    const customerSegments = [
      { name: 'New Customers', percentage: Math.round((newCustomers / totalCustomers) * 100) || 0 },
      { name: 'Returning Customers', percentage: Math.round((returningCount / totalCustomers) * 100) || 0 },
      { name: 'One-time Buyers', percentage: Math.round((oneTimeCount / totalCustomers) * 100) || 0 }
    ];
    
    // For simplicity, we'll return static marketing data for now
    // In a real app, you'd calculate this from real data
    const marketingEffectiveness = [
      { channel: 'Email', conversion: '4.2%', roi: '320%' },
      { channel: 'Social Media', conversion: '2.8%', roi: '180%' },
      { channel: 'Search Ads', conversion: '3.5%', roi: '210%' }
    ];
    
    res.json({
      totalVisitors,
      conversionRate,
      averageOrderValue,
      topSellingProducts: topProducts,
      customerSegments,
      marketingEffectiveness
    });
    
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;