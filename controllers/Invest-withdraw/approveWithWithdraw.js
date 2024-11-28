const User = require("../../models/User");
const WithdrawModel = require("../../models/Withdraw");

const approveWithdraw = async (req, res) => {
  try {
    const { withdraw_id, status } = req.body;

    // Check if withdrawal exists
    const withdraw = await WithdrawModel.findOne({ user_id: withdraw_id });
    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal request not found",
      });
    }

    const _id = withdraw.user_id;
    // console.log("withdraw", _id);

    // Find the user associated with the withdrawal
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("withdraw", user._id);

    if (status === "approved") {
      // Deduct amount from user balance
      const newUser = await User.findOneAndUpdate(
        { _id: user._id},  
        {
          $inc: { balance: -withdraw.pending_balance },
        },
        { new: true, runValidators: true } 
      );
    //   console.log('newuser', newUser)

      withdraw.status = "approved";
      withdraw.pending_balance = 0;
      await withdraw.save();

      res.status(200).json({
        success: true,
        message: "Withdrawal request approved",
        data: withdraw,
      });
    } else if (status === "rejected") {
      // Reject withdrawal request
      withdraw.status = "rejected";
      withdraw.pending_balance = 0;
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

module.exports = {
  approveWithdraw,
};
