const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  investor_id: {
    type: String,
    required: true
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyPackage',
    required: true
  },
  last_claimed: {
    type: Date,
    required: true,
    default: Date.now
  },
  total_claims: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
claimSchema.index({ investor_id: 1, package_id: 1 });

const ClaimModel = mongoose.model('Claim', claimSchema);
module.exports = { ClaimModel };