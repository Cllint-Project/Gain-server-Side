// const mongoose = require('mongoose');

// const withdrawSchema = new mongoose.Schema({
//   user_id: {
//     type: String,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 160
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   payment_method: {
//     type: String,
//     required: true
//   },
//   account_number: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// const WithdrawModel = mongoose.model('Withdraw', withdrawSchema);
// module.exports = WithdrawModel;


const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  user_id: {
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
