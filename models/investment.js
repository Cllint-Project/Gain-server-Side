const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    machine_name: {
      type: String,
      required: true,
    },
    machine_image: {
      type: String,
      required: true,
    },
    investment_amount: {
      type: String,  // or use Number if you prefer
      required: true,
    },
    investment_duration: {
      type: Number,  // Store as a number (e.g., 44 instead of "44 days")
      required: true,
    },
    daily_income: {
      type: String,  // or use Number if you prefer
      required: true,
    },
    total_income: {
      type: String,  // or use Number if you prefer
      required: true,
      validate: {
        validator: function () {
          const daily = parseFloat(this.daily_income); // Convert daily income to a number
          const total = parseFloat(this.total_income); // Convert total income to a number
          return total === daily * this.investment_duration; // Validate the calculation
        },
        message: 'Total income must equal daily income multiplied by investment duration',
      },
    },
    invest_rate: {
      type: String,  // or use Number if you prefer
      required: true,
    },
    invest_limit: {
      type: String,  // or use Number if you prefer
      required: true,
    },
    vipStatus: {
      type: String,
      enum: ['vip', 'normal'], // Ensures only 'vip' or 'normal' values are accepted
      required: true,
    }
  }, { timestamps: true });
  
const InvestmentModel = mongoose.model('Investment', investmentSchema);

module.exports = InvestmentModel;
