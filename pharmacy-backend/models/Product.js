const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  inStock: Boolean,
  tags: [String]  // Add tags array to the schema
});

module.exports = mongoose.model('Product', productSchema);