const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecret'; // από .env file ιδανικά

// Register
router.post('/register', async (req, res) => {
  console.log('📥 Entering /register');
  console.log('📥 Payload:', req.body);
  
  const { email, username, password, isAdmin } = req.body;
  // Check if we have either email or username
  const userIdentifier = email || username;
  
  if (!userIdentifier || !password) {
    console.log('❌ Missing email/username or password');
    return res.status(400).json({ error: 'Missing email/username or password' });
  }
  
  try {
    // Pass the plain password - model will hash it
    const user = new User({
      email: email || username,
      password: password,  // Plain password - will be hashed by pre-save hook
      isAdmin: isAdmin || false  // Set admin status, default to false
    });
    await user.save();
    console.log('✅ User saved:', user._id);
    
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('📥 Entering /login');
  console.log('📥 Payload:', req.body);
  
  const { email, username, password } = req.body;
  const userIdentifier = email || username;
  
  if (!userIdentifier || !password) {
    console.log('❌ Missing email/username or password');
    return res.status(400).json({ error: 'Missing email/username or password' });
  }
  
  try {
    // Find user by email field
    const user = await User.findOne({ email: userIdentifier });
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ error: 'Invalid email/username' });
    }
    
    console.log('🔍 Found user:', user._id);
    console.log('🔍 Stored password hash:', user.password);
    console.log('🔍 Input password:', password);
    
    // Try direct string comparison (for debugging only)
    const rawMatch = password === user.password;
    console.log('🔍 Raw string comparison:', rawMatch);
    
    // Normal bcrypt comparison
    const match = await bcrypt.compare(password, user.password);
    console.log('🔍 Bcrypt comparison result:', match);
    
    if (!match) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    // Include isAdmin in the token payload
    const token = jwt.sign({ 
      id: user._id,
      isAdmin: user.isAdmin || false 
    }, JWT_SECRET, { expiresIn: '1d' });
    
    console.log('✅ Login successful, isAdmin:', user.isAdmin);

    // Return isAdmin status with the response
    res.json({ 
      token,
      isAdmin: user.isAdmin || false
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    console.error('Error details:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;