// routes/products.js - Updated with search functionality
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with optional search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    if (search) {
      // If there's a search query, perform a search across multiple fields
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { tags: searchRegex }
        ]
      });
      
      return res.json(products);
    }
    
    // If no search query, return all products
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();
  res.status(201).json(saved);
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
});

module.exports = router;