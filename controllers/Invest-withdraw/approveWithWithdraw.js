const User = require("../../models/User");
const WithdrawModel = require("../../models/Withdraw");

exports.approveWithdraw = async (req, res) => {
  try {
    const { user_id, withdraw_id, status } = req.body;

    const withdraw = await WithdrawModel.findOne({ _id: withdraw_id });
    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (status === "approved") {
      const deductAmount = Number(withdraw.pending_balance);
      if (isNaN(deductAmount)) {
        return res.status(400).json({
          success: false,
          message: "Invalid withdrawal amount",
        });
      }

      if (user.balance < deductAmount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }

      // Add withdrawal record and update balance
      await user.addBalanceRecord(-deductAmount, 'package');
      
      withdraw.status = "approved";
      await withdraw.save();

      res.status(200).json({
        success: true,
        message: "Withdrawal request approved",
        data: {
          withdraw,
          todayBalance: user.getTodayBalance(),
          todayBonus: user.getTodayBonus()
        }
      });
    } else if (status === "rejected") {
      withdraw.status = "rejected";
      await withdraw.save();

      res.status(200).json({
        success: true,
        message: "Withdrawal request rejected",
        data: withdraw,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update withdrawal request",
      error: error.message,
    });
  }
};