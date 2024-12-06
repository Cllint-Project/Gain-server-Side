
const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  pending_balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const WithdrawModel = mongoose.model('Withdraw', withdrawSchema);
module.exports = WithdrawModel;
