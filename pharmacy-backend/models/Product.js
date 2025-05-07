const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  inStock: Boolean,
  category: String,
  image: String,  // Add this field for the image filename
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
