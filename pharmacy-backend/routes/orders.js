// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
// In routes/orders.js
router.post('/', async (req, res) => {
    try {
      // Validate request
      if (!req.body.userId || !req.body.items || !req.body.total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Create order with status and date
      const newOrder = new Order({
        userId: req.body.userId,
        items: req.body.items,
        total: req.body.total,
        status: 'pending',
        orderDate: new Date()
      });
  
      const savedOrder = await newOrder.save();
      
      // Return complete order data
      res.status(201).json({
        ...savedOrder.toObject(),
        _id: savedOrder._id // Ensure ID is included
      });
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


// routes/orders.js
router.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});


module.exports = router;