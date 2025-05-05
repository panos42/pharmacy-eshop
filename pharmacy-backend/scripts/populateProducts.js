// scripts/populateProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/pharmacy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
  {
    name: "Aspirin 325mg",
    price: 4.99,
    category: "Pain Relief",
    description: "Pain reliever, fever reducer, and anti-inflammatory. Also used as a blood thinner for prevention of heart attack and stroke in high-risk patients.",
    inStock: true
  },
  {
    name: "Vitamin D3 1000IU",
    price: 12.99,
    category: "Vitamins & Supplements",
    description: "Essential vitamin that helps maintain strong bones and supports immune function. Helps with calcium absorption and bone health.",
    inStock: true
  },
  {
    name: "Vitamin C 500mg",
    price: 8.50,
    category: "Vitamins & Supplements",
    description: "Antioxidant vitamin that supports immune function and collagen production. Helps maintain healthy skin, blood vessels, bones and cartilage.",
    inStock: true
  },
  {
    name: "Multivitamin Daily",
    price: 15.99,
    category: "Vitamins & Supplements",
    description: "Comprehensive multivitamin formula containing essential vitamins and minerals to support overall health and wellbeing.",
    inStock: true
  },
  {
    name: "Omega-3 Fish Oil",
    price: 19.99,
    category: "Vitamins & Supplements",
    description: "Supports heart health, brain function, and reduces inflammation. Contains EPA and DHA essential fatty acids.",
    inStock: true
  },
  {
    name: "Cetirizine 10mg",
    price: 11.49,
    category: "Allergy Relief",
    description: "24-hour relief from allergy symptoms like sneezing, runny nose, itchy eyes, and throat. Non-drowsy formula.",
    inStock: true
  },
  {
    name: "Loratadine 10mg",
    price: 10.99,
    category: "Allergy Relief",
    description: "24-hour relief from allergy symptoms like sneezing, runny nose, itchy eyes, and throat. Non-drowsy formula.",
    inStock: true
  },
  {
    name: "Diphenhydramine 25mg",
    price: 7.99,
    category: "Allergy Relief",
    description: "Antihistamine providing relief from allergy symptoms. May cause drowsiness and can be used as a sleep aid.",
    inStock: true
  },
  {
    name: "Amoxicillin 500mg",
    price: 15.99,
    category: "Antibiotics",
    description: "Prescription antibiotic used to treat bacterial infections. Requires a valid prescription.",
    inStock: false
  },
  {
    name: "Azithromycin 250mg",
    price: 22.99,
    category: "Antibiotics",
    description: "Prescription antibiotic used to treat bacterial infections. Requires a valid prescription.",
    inStock: false
  },
  {
    name: "Metformin 500mg",
    price: 12.99,
    category: "Diabetes",
    description: "Prescription medication for type 2 diabetes. Requires a valid prescription.",
    inStock: false
  },
  {
    name: "Lisinopril 10mg",
    price: 10.99,
    category: "Blood Pressure",
    description: "Prescription medication for high blood pressure and heart failure. Requires a valid prescription.",
    inStock: false
  },
  {
    name: "Atorvastatin 20mg",
    price: 16.99,
    category: "Cholesterol",
    description: "Prescription medication to lower cholesterol levels. Requires a valid prescription.",
    inStock: false
  },
  {
    name: "First Aid Kit",
    price: 24.99,
    category: "First Aid",
    description: "Comprehensive first aid kit containing bandages, antiseptic wipes, gauze, tape, scissors, and more.",
    inStock: true
  },
  {
    name: "Adhesive Bandages",
    price: 3.99,
    category: "First Aid",
    description: "Pack of 50 assorted size adhesive bandages for minor cuts and scrapes.",
    inStock: true
  },
  {
    name: "Hydrogen Peroxide 3%",
    price: 2.49,
    category: "First Aid",
    description: "Antiseptic solution for cleaning minor wounds and preventing infection.",
    inStock: true
  },
  {
    name: "Digital Thermometer",
    price: 9.99,
    category: "Health Devices",
    description: "Digital thermometer for accurate temperature readings. Easy to read LCD display.",
    inStock: true
  },
  {
    name: "Blood Pressure Monitor",
    price: 49.99,
    category: "Health Devices",
    description: "Digital blood pressure monitor for home use. Easy to use with large display.",
    inStock: true
  },
  {
    name: "Glucose Meter",
    price: 29.99,
    category: "Health Devices",
    description: "Digital glucose meter for monitoring blood sugar levels. Fast and accurate results.",
    inStock: true
  },
  {
    name: "Hand Sanitizer",
    price: 3.99,
    category: "Personal Care",
    description: "70% alcohol hand sanitizer that kills 99.9% of germs. Travel size.",
    inStock: true
  },
  {
    name: "Facial Tissues",
    price: 2.49,
    category: "Personal Care",
    description: "Box of 100 soft, 2-ply facial tissues.",
    inStock: true
  },
  {
    name: "Sunscreen SPF 50",
    price: 12.99,
    category: "Skin Care",
    description: "Broad-spectrum SPF 50 sunscreen lotion. Water-resistant for up to 80 minutes.",
    inStock: true
  },
  {
    name: "Moisturizing Lotion",
    price: 8.99,
    category: "Skin Care",
    description: "Daily moisturizing lotion for dry, sensitive skin. Fragrance-free.",
    inStock: true
  },
  {
    name: "Lip Balm",
    price: 2.99,
    category: "Skin Care",
    description: "Moisturizing lip balm with SPF 15 protection. Soothes dry, chapped lips.",
    inStock: true
  },
  {
    name: "Cough Syrup",
    price: 9.99,
    category: "Cold & Flu",
    description: "Relieves cough due to minor throat and bronchial irritation. For adults and children over 12 years.",
    inStock: true
  },
  {
    name: "Nasal Decongestant",
    price: 7.99,
    category: "Cold & Flu",
    description: "Provides temporary relief of nasal and sinus congestion due to the common cold, hay fever, or other upper respiratory allergies.",
    inStock: true
  },
  {
    name: "Throat Lozenges",
    price: 4.99,
    category: "Cold & Flu",
    description: "Temporarily relieves minor sore throat pain and cough associated with a cold.",
    inStock: true
  }
];

const populateProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(pharmacyProducts);
    console.log(`Added ${result.length} products to the database`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating products:', error);
    mongoose.connection.close();
  }
};

populateProducts();