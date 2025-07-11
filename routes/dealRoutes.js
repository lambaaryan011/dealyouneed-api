const express = require('express');
const Deal = require('../models/Deal');
const User = require('../models/User');
const router = express.Router();

// POST /deals - Add a new deal
router.post('/', async (req, res) => {
  try {
    const { id, title, price, category, partner } = req.body;

    // Check if deal already exists
    const existingDeal = await Deal.findOne({ id });
    if (existingDeal) {
      return res.status(400).json({ 
        error: 'Deal with this ID already exists' 
      });
    }

    const deal = new Deal({
      id,
      title,
      price,
      category,
      partner
    });

    await deal.save();
    res.status(201).json({
      message: 'Deal created successfully',
      deal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /deals - List all deals with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const deals = await Deal.find(filter);
    res.json({
      deals,
      count: deals.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /claim/:userId/:dealId - Claim a deal
router.post('/claim/:userId/:dealId', async (req, res) => {
  try {
    const { userId, dealId } = req.params;

    // Find user and deal
    const user = await User.findOne({ id: userId });
    const deal = await Deal.findOne({ id: dealId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Check if user has already claimed this deal
    const alreadyClaimed = user.claimedDeals.some(
      claimed => claimed.dealId === dealId
    );
    if (alreadyClaimed) {
      return res.status(400).json({ 
        error: 'Deal already claimed by this user' 
      });
    }

    // Check if user has sufficient balance
    if (user.walletBalance < deal.price) {
      return res.status(400).json({ 
        error: 'Insufficient wallet balance',
        required: deal.price,
        available: user.walletBalance
      });
    }

    // Deduct amount and add to claimed deals
    user.walletBalance -= deal.price;
    user.claimedDeals.push({
      dealId: deal.id,
      title: deal.title,
      price: deal.price
    });

    await user.save();

    res.json({
      message: 'Deal claimed successfully',
      user: {
        id: user.id,
        name: user.name,
        walletBalance: user.walletBalance,
        claimedDeal: {
          id: deal.id,
          title: deal.title,
          price: deal.price
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
