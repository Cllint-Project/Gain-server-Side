const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  recharge_amount: {
    type: String,
    required: true
  },
  recharge_option: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  admin_number: {
    type: String,
    required: true
  },
  investor_id: {
    type: String,
    required: true
  },
  investor_name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  recharge_status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const MainRechargeModel = mongoose.model('MainRecharge', rechargeSchema);
module.exports = MainRechargeModel;