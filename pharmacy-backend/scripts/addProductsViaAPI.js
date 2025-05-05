// scripts/addProductsViaAPI.js
const axios = require('axios');

const API_URL = 'http://localhost:3000/products';

const pharmacyProducts = [
  {
    name: "Ibuprofen 200mg",
    price: 6.99,
    category: "Pain Relief",
    description: "Pain reliever and fever reducer for adults and children over 12 years. Relieves minor aches and pains due to headache, muscular aches, backache, minor arthritis pain, toothache, and menstrual cramps.",
    inStock: true
  },
  {
    name: "Acetaminophen 500mg",
    price: 5.49,
    category: "Pain Relief",
    description: "Pain reliever and fever reducer for adults and children over 12 years. Used for temporary relief of minor aches and pains due to headache, muscular aches, backache, minor arthritis pain, toothache, and menstrual cramps.",
    inStock: true
  },
  // Include more products (same as in the populateProducts.js script)
];

async function addProducts() {
  try {
    console.log(`Adding ${pharmacyProducts.length} products via API...`);
    
    for (const product of pharmacyProducts) {
      try {
        const response = await axios.post(API_URL, product);
        console.log(`Added product: ${product.name} (ID: ${response.data._id})`);
      } catch (error) {
        console.error(`Failed to add product ${product.name}:`, error.response?.data || error.message);
      }
      
      // Small delay to prevent overloading the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('All products have been added successfully!');
  } catch (error) {
    console.error('Error adding products:', error.message);
  }
}

addProducts();