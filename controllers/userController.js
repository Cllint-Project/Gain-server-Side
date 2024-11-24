const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateVipStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.vipStatus = true;
    await user.save();
    res.json({ message: 'VIP status updated successfully', vipStatus: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};