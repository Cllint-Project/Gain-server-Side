const BuyPackageModel = require("../../models/BuyPackageModel");

exports.updateRechargeController = async (req, res) => {
  try {
    const data = req.body;

    const user = await BuyPackageModel.create(data);
    res.json({
      message: "recharged successfully",
      // data: user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
