const Deal = require('../models/Deal');
const User = require('../models/User');

exports.createDeal = async (req, res) => {
  try {
    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllDeals = async (req, res) => {
  try {
    const query = req.query.category
      ? { category: req.query.category }
      : {};
    const deals = await Deal.find(query);
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.claimDeal = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    const deal = await Deal.findOne({ id: req.params.dealId });

    if (!user || !deal)
      return res.status(404).json({ error: 'User or Deal not found' });

    if (user.walletBalance < deal.price)
      return res.status(400).json({ error: 'Insufficient balance' });

    user.walletBalance -= deal.price;
    user.claimedDeals.push(deal.id);
    await user.save();

    res.json({ message: 'Deal claimed successfully', newBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
