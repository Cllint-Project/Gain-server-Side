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

    // Check minimum withdraw amount
    if (amount < 160) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is 160 TK'
      });
    }

    // Check user balance
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create withdraw request with pending status
    const withdraw = await WithdrawModel.create({
      user_id,
      payment_method,
      account_number,
      pending_balance: amount // Update pending balance
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully. Status is pending.',
      data: withdraw
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create withdrawal request',
      error: error.message
    });
  }
};

module.exports = {
  createWithdraw
};
