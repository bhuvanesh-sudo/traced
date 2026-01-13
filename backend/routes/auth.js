const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: '1h' });
    
    // Return Token + User Data (XP, Preferences) 
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            username: user.username, 
            xp: user.xp,
            preferences: user.preferences 
        } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;