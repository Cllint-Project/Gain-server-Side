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
    console.log(withdraw, 16)

    // Find the user
    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(user, 27)

    if (status === "approved") {
      // Convert amount to number and ensure it's valid
      const deductAmount = Number(withdraw.pending_balance);
      if (isNaN(deductAmount)) {
        return res.status(400).json({
          success: false,
          message: "Invalid withdrawal amount",
        });
      }

      // Check if user has sufficient balance
      if (user.balance < deductAmount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }

      // Deduct amount from user balance
      const newUser = await User.findOneAndUpdate(
        { _id: user_id },
        {
          $inc: { balance: -deductAmount },
        },
        { new: true, runValidators: true }
      );

      withdraw.status = "approved";
      await withdraw.save();

      res.status(200).json({
        success: true,
        message: "Withdrawal request approved",
        data: withdraw,
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

