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
    res.json({ 
      message: 'machine details data get successfully',
      data: response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};