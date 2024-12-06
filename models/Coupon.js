
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
  couponAmount: {
    type: Number,
    required: true,
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
