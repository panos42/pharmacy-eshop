// scripts/cleanDatabase.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Visit = require('../models/Visit');

mongoose.connect('mongodb://127.0.0.1:27017/pharmacy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const cleanDatabase = async () => {
  try {
    // Delete all collections
    await User.deleteMany({});
    console.log('Deleted all users');
    
    await Product.deleteMany({});
    console.log('Deleted all products');
    
    await Order.deleteMany({});
    console.log('Deleted all orders');
    
    await Visit.deleteMany({});
    console.log('Deleted all visits');
    
    console.log('Database cleaned successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error cleaning database:', error);
    mongoose.connection.close();
  }
};

cleanDatabase();