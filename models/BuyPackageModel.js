const mongoose = require('mongoose');

const machineDetailsSchema = new mongoose.Schema({
  machine_name: {
    type: String,
    required: true
  },
  investment_amount: {
    type: String,
    required: true
  },
  investment_duration: {
    type: Number,
    required: true
  },
  daily_income: {
    type: String,
    required: true
  },
  total_income: {
    type: String,
    required: true
  },
  invest_rate: {
    type: String,
    required: true
  },
  invest_limit: {
    type: String,
    required: true
  },
  vipStatus: {
    type: String,
    enum: ['normal', 'vip'],
    default: 'normal'
  },
  machine_image: {
    type: String,
    // required: true
  }
}, {
  timestamps: true
});

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
  },
  machine_details: {
    type: machineDetailsSchema,
    required: true
  }
}, {
  timestamps: true
});

const BuyPackageModel = mongoose.model('BuyPackage', rechargeSchema);
module.exports = BuyPackageModel;