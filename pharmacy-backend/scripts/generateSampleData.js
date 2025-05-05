// scripts/generateSampleData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Visit = require('../models/Visit');

mongoose.connect('mongodb://127.0.0.1:27017/pharmacy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Helper function to generate random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random users
const generateUsers = async (count) => {
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 0; i < count; i++) {
    const isAdmin = i === 0; // Make first user an admin
    const createdAt = randomDate(new Date(2023, 0, 1), new Date());
    
    users.push({
      email: `user${i + 1}@example.com`,
      password: hashedPassword,
      isAdmin,
      createdAt
    });
  }
  
  return User.insertMany(users);
};

// Generate random visits
const generateVisits = async (users, count) => {
  const visits = [];
  const pages = ['/home', '/products', '/cart', '/checkout', '/product/1', '/product/2'];
  const devices = ['desktop', 'mobile', 'tablet'];
  const referrers = ['google.com', 'facebook.com', 'bing.com', 'direct', 'twitter.com'];
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  for (let i = 0; i < count; i++) {
    const randomUser = i % 3 === 0 ? users[Math.floor(Math.random() * users.length)]._id : null;
    const sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
    
    visits.push({
      userId: randomUser,
      sessionId,
      page: pages[Math.floor(Math.random() * pages.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      date: randomDate(startDate, endDate),
      device: devices[Math.floor(Math.random() * devices.length)]
    });
  }
  
  return Visit.insertMany(visits);
};

// Generate random orders
const generateOrders = async (users, products, count) => {
  const orders = [];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  for (let i = 0; i < count; i++) {
    const orderItems = [];
    const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items per order
    let total = 0;
    
    // Add random products to the order
    for (let j = 0; j < itemCount; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      
      orderItems.push({
        productId: randomProduct._id,
        name: randomProduct.name,
        price: randomProduct.price,
        quantity
      });
      
      total += randomProduct.price * quantity;
    }
    
    // Add shipping cost
    total += 3.00;
    
    orders.push({
      userId: users[Math.floor(Math.random() * users.length)]._id,
      items: orderItems,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      orderDate: randomDate(startDate, endDate)
    });
  }
  
  return Order.insertMany(orders);
};

// Main function to generate all sample data
const generateSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Visit.deleteMany({});
    await Order.deleteMany({});
    
    console.log('Cleared existing users, visits, and orders');
    
    // Get products (assume they're already populated)
    const products = await Product.find();
    if (products.length === 0) {
      console.error('No products found. Please run populateProducts.js first.');
      mongoose.connection.close();
      return;
    }
    
    // Generate users, visits, and orders
    const users = await generateUsers(50);
    console.log(`Generated ${users.length} users`);
    
    const visits = await generateVisits(users, 1000);
    console.log(`Generated ${visits.length} visits`);
    
    const orders = await generateOrders(users, products, 200);
    console.log(`Generated ${orders.length} orders`);
    
    console.log('Sample data generation complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error generating sample data:', error);
    mongoose.connection.close();
  }
};

generateSampleData();