// const mongoose = require("mongoose");

// const couponSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   isSecret: {
//     type: Boolean,
//     default: false,
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
//   expirationMinutes: {
//     type: Number,
//     required: true,
//     default: 5,
//   },
//   isUsed: {
//     type: Boolean,
//     default: false,
//   },
//   usedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const CouponModel = mongoose.model("Coupon", couponSchema);
// module.exports = CouponModel;

const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isSecret: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  expirationMinutes: {
    type: Number,
    required: true,
    default: 5,
  },
  usages: [usageSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
