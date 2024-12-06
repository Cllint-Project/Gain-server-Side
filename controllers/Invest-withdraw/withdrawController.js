
const User = require("../../models/User");
const WithdrawModel = require("../../models/Withdraw");
const createWithdraw = async (req, res) => {
  try {
    const { user_id, amount, payment_method, account_number,username } = req.body;

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
      username,
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

const getWithdrawsHistory = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (userId) {
      query.user_id = userId;
    }
    
    const total = await WithdrawModel.countDocuments(query);
    const withdrawals = await WithdrawModel.find(query)
    .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (withdrawals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No withdrawals data found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Withdrawals retrieved successfully",
      data: withdrawals,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch withdrawals",
      error: error.message,
    });
  }
};

// get withdraw details for all users
const getWithdrawals = async (req, res) => {
  try {
    const { withDrawStatus } = req?.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (withDrawStatus && withDrawStatus !== "all") {
      query.status = withDrawStatus;
    }

    const total = await WithdrawModel.countDocuments(query);
    const withdrawals = await WithdrawModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (withdrawals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recharge data found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Withdrawals retrieved successfully",
      data: withdrawals,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
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
  getWithdrawsHistory,
  getWithdrawals
};
