const RechargeModel = require("../models/rechargeModel");


exports.submitRechargeController = async (req, res) => {
    try {

        const data = req.body;
        console.log(data,'dshfjkhdfhdh')
      const user = await RechargeModel.create(data);
      res.json({ 
        message: 'recharged successfully',
        // data: user
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  