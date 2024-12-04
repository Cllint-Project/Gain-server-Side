const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lotteryNumber: {
    type: String,
    required: true,
    length: 4
  },
  amount: {
    type: Number,
    required: true,
    enum: [100, 200, 500]
  },
  isWinner: {
    type: Boolean,
    default: false
  },
  weekNumber: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
lotterySchema.index({ weekNumber: 1, year: 1 });
lotterySchema.index({ lotteryNumber: 1 });
lotterySchema.index({ user: 1 });

const Lottery = mongoose.model('Lottery', lotterySchema);
module.exports = Lottery;