const BuyPackageModel = require("../models/BuyPackageModel");


exports.submitInvestController = async (req, res) => {
    try {

      const data = req.body;
      console.log(data,8)
      const user = await BuyPackageModel.create(data);
      res.json({ 
        message: 'recharged successfully',
        // data: user
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  