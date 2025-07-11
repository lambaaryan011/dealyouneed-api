const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /user - Create a new user
router.post('/', async (req, res) => {
  try {
    const { id, name, email, walletBalance = 100 } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this ID or email already exists' 
      });
    }

    const user = new User({
      id,
      name,
      email,
      walletBalance
    });

    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /user/:id - Get user info
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
      claimedDeals: user.claimedDeals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
