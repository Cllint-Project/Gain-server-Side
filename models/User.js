const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const balanceHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['bonus', 'referral', 'coupon', 'package', 'lottery', 'lottery_win'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    trim: true
  },
  profileImage: { 
    type: String,
    required: true
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['admin', 'normal-user'],
    default: 'normal-user'
  },
  password: { 
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  bonus_balance: {
    type: Number,
    default: 0,
    min: 0
  },
  todayBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  todayBonus: {
    type: Number,
    default: 0,
    min: 0
  },
  lastBalanceUpdate: {
    type: Date,
    default: Date.now
  },
  balanceHistory: [balanceHistorySchema],
  referralCode: { 
    type: String,
    unique: true,
    default: function() {
      return `${this.username.toUpperCase()}-${Math.random().toString(36).substr(2, 6)}`;
    }
  },
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add balance change record and update daily totals
userSchema.methods.addBalanceRecord = async function(amount, type) {
  if (!['bonus', 'referral', 'coupon', 'package', 'lottery', 'lottery_win'].includes(type)) {
    throw new Error('Invalid balance record type');
  }

  const record = {
    amount: Number(amount),
    type,
    timestamp: new Date()
  };

  // Reset daily totals if it's a new day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastUpdate = new Date(this.lastBalanceUpdate);
  lastUpdate.setHours(0, 0, 0, 0);
  
  if (lastUpdate < today) {
    this.todayBalance = 0;
    this.todayBonus = 0;
  }

  // Update balances based on transaction type
  this.balanceHistory.push(record);

  if (type === 'lottery') {
    // Lottery ticket purchase - deduct from main balance only
    this.balance = Math.max(0, this.balance + amount);
    this.todayBalance = Math.max(0, this.todayBalance + amount);
  } 
  else if (type === 'lottery_win') {
    // Lottery winnings - add to both main and bonus balance
    this.balance = Math.max(0, this.balance + amount);
    this.todayBalance = Math.max(0, this.todayBalance + amount);
    this.bonus_balance = Math.max(0, this.bonus_balance + amount);
    this.todayBonus = Math.max(0, this.todayBonus + amount);
  }
  else if (['bonus', 'referral', 'coupon'].includes(type)) {
    // Other bonus transactions
    this.balance = Math.max(0, this.balance + amount);
    this.todayBalance = Math.max(0, this.todayBalance + amount);
    this.bonus_balance = Math.max(0, this.bonus_balance + amount);
    this.todayBonus = Math.max(0, this.todayBonus + amount);
  }
  else {
    // Regular transactions
    this.balance = Math.max(0, this.balance + amount);
    this.todayBalance = Math.max(0, this.todayBalance + amount);
  }

  this.lastBalanceUpdate = record.timestamp;
  return this.save();
};

// Get today's bonus
userSchema.methods.getTodayBonus = function() {
  return this.todayBonus;
};

// Get today's total balance changes
userSchema.methods.getTodayBalance = function() {
  return this.todayBalance;
};

const User = mongoose.model('User', userSchema);

module.exports = User;