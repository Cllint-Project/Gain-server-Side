const User = require('../models/User');
const InvestmentModel = require('../models/investment');
exports.InvestController = async (req, res) => {
  try {

    const data = req.body;

    const response = await InvestmentModel.create(data)

    res.json({ 
      message: 'recharge received successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getInvestDataController = async (req, res) => {
  try {
    const response = await InvestmentModel.find({})
// console.log(response)
    res.json({ 
      message: 'recharge received successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAInvestDetailsController = async (req, res) => {
  try {
    const _id = req.params.Id;
    const response = await InvestmentModel.findOne({_id})
// console.log(response)
    res.json({ 
      message: 'machine details data get successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// [
//   {
//     "investment_amount": "3600",
//     "investment_duration": "44 days",
//     "daily_income": "160",
//     "total_income": "7040",
//     "invest_rate": "150%",
//     "vipStatus": "vip",
//     "inverter": "0177777489",
//     "machine_name": "M-44"
//   },
//   {
//     "investment_amount": "5000",
//     "investment_duration": "30 days",
//     "daily_income": "200",
//     "total_income": "6000",
//     "invest_rate": "120%",
//     "vipStatus": "vip",
//     "inverter": "0178888888",
//     "machine_name": "M-30"
//   },
//   {
//     "investment_amount": "10000",
//     "investment_duration": "60 days",
//     "daily_income": "400",
//     "total_income": "24000",
//     "invest_rate": "140%",
//     "vipStatus": "vip",
//     "inverter": "0179999999",
//     "machine_name": "M-60"
//   },
//   {
//     "investment_amount": "2000",
//     "investment_duration": "20 days",
//     "daily_income": "50",
//     "total_income": "1000",
//     "invest_rate": "110%",
//     "vipStatus": "normal",
//     "inverter": "0171111111",
//     "machine_name": "N-20"
//   },
//   {
//     "investment_amount": "3500",
//     "investment_duration": "35 days",
//     "daily_income": "100",
//     "total_income": "3500",
//     "invest_rate": "115%",
//     "vipStatus": "normal",
//     "inverter": "0172222222",
//     "machine_name": "N-35"
//   },
//   {
//     "investment_amount": "8000",
//     "investment_duration": "50 days",
//     "daily_income": "150",
//     "total_income": "7500",
//     "invest_rate": "130%",
//     "vipStatus": "normal",
//     "inverter": "0173333333",
//     "machine_name": "N-50"
//   }
// ]
