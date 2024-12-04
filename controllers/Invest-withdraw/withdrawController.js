// const User = require("../../models/User");
// const WithdrawModel = require("../../models/Withdraw");

const User = require("../../models/User");
const WithdrawModel = require("../../models/Withdraw");

// const createWithdraw = async (req, res) => {
//   try {
//     const { user_id, amount, payment_method, account_number } = req.body;

//     // Check minimum withdraw amount
//     if (amount < 160) {
//       return res.status(400).json({
//         success: false,
//         message: 'Minimum withdrawal amount is 160 TK'
//       });
//     }

//     // Check user balance
//     const user = await User.findById(user_id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (user.balance < amount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Insufficient balance'
//       });
//     }

//     // Create withdraw request
//     const withdraw = await WithdrawModel.create({
//       user_id,
//       amount,
//       payment_method,
//       account_number
//     });

//     // Deduct amount from user balance
//     await User.findByIdAndUpdate(user_id, {
//       $inc: { balance: -amount }
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Withdrawal request created successfully',
//       data: withdraw
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create withdrawal request',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   createWithdraw
// };

const createWithdraw = async (req, res) => {
  try {
    const { user_id, amount, payment_method, account_number } = req.body;

    console.log(req.body, 'createwithdraw')
    // Check minimum withdraw amount
    if (amount < 160) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is 160 TK",
      });
    }

    // Check user balance
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Create withdraw request with pending status
    const withdraw = await WithdrawModel.create({
      user_id,
      payment_method,
      account_number,
      pending_balance: amount, // Update pending balance
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully. Status is pending.",
      data: withdraw,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create withdrawal request",
      error: error.message,
    });
  }
};

const getWithdrawals = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Add status filter if provided and not 'all'
    if (status && status !== "all") {
      query.status = status;
    }

    const withdrawals = await WithdrawModel.find(query).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({
      success: true,
      message: "Withdrawals retrieved successfully",
      data: withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawals",
      error: error.message,
    });
  }
};
const getWithdrawsHistory = async (req, res) => {
  try {
    const { status, userId } = req.query; 
    let query = {};
console.log(status, userId)
    if (status && status !== "all") {
      query.status = status;
    }

    if (userId) {
      query.user_id = userId;
    }

    const withdrawals = await WithdrawModel.find(query).sort({ createdAt: -1 });
    console.log('withdrawels', withdrawals)
    res.status(200).json({
      success: true,
      message: "Withdrawals retrieved successfully",
      data: withdrawals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawals",
      error: error.message,
    });
  }
};


module.exports = {
  createWithdraw,
  getWithdrawals,
  getWithdrawsHistory
};
