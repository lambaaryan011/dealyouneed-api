const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  partner: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deal', dealSchema);
