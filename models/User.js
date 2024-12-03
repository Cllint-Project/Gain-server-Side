const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    default: 0
  },
  bonus_balance: {
    type: Number,
    default: 0
  },
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
  // referralEarnings: {
  //   type: Number,
  //   default: 0
  // },
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

// Get today's bonus
userSchema.methods.getTodayBonus = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bonusDate = new Date(this.lastBonusDate);
  bonusDate.setHours(0, 0, 0, 0);
  
  return bonusDate.getTime() === today.getTime() ? this.bonus_balance : 0;
};

const User = mongoose.model('User', userSchema);

module.exports = User;