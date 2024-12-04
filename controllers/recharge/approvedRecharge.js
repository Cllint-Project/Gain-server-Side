const MainRechargeModel = require("../../models/MainRecharge");
const User = require("../../models/User");

exports.approveRecharge = async (req, res) => {
  try {
    const { investor_id, recharge_id, status } = req.body;
    
    const recharge = await MainRechargeModel.findOne({ _id: recharge_id });
    if (!recharge) {
      return res.status(404).json({
        success: false,
        message: "Recharge request not found",
      });
    }

    const user = await User.findOne({ _id: investor_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Investor not found",
      });
    }

    if (status === "approved") {
      const rechargeAmount = Number(recharge.recharge_amount);
      if (isNaN(rechargeAmount)) {
        return res.status(400).json({
          success: false,
          message: "Invalid recharge amount",
        });
      }

      // Add recharge record and update balance
      await user.addBalanceRecord(rechargeAmount, 'package');

      recharge.recharge_status = "approved";
      await recharge.save();

      res.status(200).json({
        success: true,
        message: "Recharge request approved successfully",
        data: {
          recharge,
          todayBalance: user.getTodayBalance(),
          todayBonus: user.getTodayBonus()
        }
      });
    } else if (status === "rejected") {
      recharge.recharge_status = "rejected";
      await recharge.save();

      res.status(200).json({
        success: true,
        message: "Recharge request rejected",
        data: recharge,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid status. Status must be either 'approved' or 'rejected'",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process recharge request",
      error: error.message,
    });
  }
};