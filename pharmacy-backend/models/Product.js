const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  inStock: Boolean
});

module.exports = mongoose.model('Product', productSchema);
