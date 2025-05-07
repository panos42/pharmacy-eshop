const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Import path module for directory resolution

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from the correct folder path
const cachedProductImagesPath = path.join(__dirname, '../public/cached_product_images');
app.use('/cached_product_images', express.static(cachedProductImagesPath));

// Logging middleware - put this BEFORE route definitions for complete logging
app.use((req, res, next) => {
  console.log(`🔎 ${req.method} ${req.url}`, req.body);
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pharmacy')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Pharmacy API is working!');
});

const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// Configure auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
// Also map the same auth routes to /users for compatibility
app.use('/users', authRoutes);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/analytics', analyticsRoutes);

// Order routes
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

// Visit routes
const visitRoutes = require('./routes/visits');
app.use('/visits', visitRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
