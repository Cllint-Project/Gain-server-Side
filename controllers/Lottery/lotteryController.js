const User = require("../../models/User");
const Lottery = require("../../models/Lottery/LotteryModel");
const {
  getCurrentWeekNumber,
  getPreviousWeekNumber,
} = require("../../utils/getCurrentWeekNumber");

// Submit new lottery ticket
exports.submitLottery = async (req, res) => {
  try {
    const { lotteryNumber, amount } = req.body;
    const userId = req.user._id;

    // Validate lottery number
    if (!/^\d{4}$/.test(lotteryNumber)) {
      return res.status(400).json({
        success: false,
        message: "Lottery number must be exactly 4 digits",
      });
    }

    // Validate amount
    if (![100, 200, 300, 500].includes(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be 100, 200,300 or 500",
      });
    }

    // Get current week number and year
    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    // Check if number already exists for current week
    const existingTicket = await Lottery.findOne({
      lotteryNumber,
      weekNumber,
      year,
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: "This lottery number is already taken for this week",
      });
    }

    // Find user and check balance
    const user = await User.findById(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Create lottery ticket
    const lottery = await Lottery.create({
      user: userId,
      lotteryNumber,
      amount,
      weekNumber,
      year,
    });

    // Deduct ticket amount from main balance only
    await user.addBalanceRecord(-amount, "lottery");

    res.status(201).json({
      success: true,
      message: "Lottery ticket submitted successfully",
      data: lottery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit lottery ticket",
      error: error.message,
    });
  }
};

// Get current week's lottery entries
exports.getCurrentWeekLotteries = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    if (weekNumber && year) {
      (query.weekNumber = weekNumber), (query.year = year);
    }
    const total = await Lottery.countDocuments(query);

    const lotteries = await Lottery.find(query)
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (lotteries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lotteries data found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "lotteries retrieved successfully",
      data: lotteries,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lottery entries",
      error: error.message,
    });
  }
};

exports.getPreviousWeekLotteries = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;

    const currentWeek = getCurrentWeekNumber();
    const year = new Date().getFullYear();
    const previousWeek = currentWeek - 1;

    // Build query dynamically
    const query = {
      weekNumber: previousWeek,
      year: year,
    };

    // Count total matching documents
    const total = await Lottery.countDocuments(query);

    // Fetch lottery data
    const lotteries = await Lottery.find(query)
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If no data found
    if (lotteries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lotteries data found.",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Lotteries retrieved successfully",
      data: lotteries,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch previous week lottery entries",
      error: error.message,
    });
  }
};

// ISO-compliant week number calculation
exports.getCurrentWeekNumber = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = (now - startOfYear + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};

exports.selectWinner = async (req, res) => {
  try {
    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    const existingWinner = await Lottery.findOne({
      weekNumber,
      year,
      isWinner: true,
    });

    if (existingWinner) {
      throw new Error("Winner already selected for this week");
    }

    const tickets = await Lottery.find({ weekNumber, year, isWinner: false });
    if (tickets.length === 0) {
      throw new Error("No eligible tickets found for this week");
    }

    const winnerIndex = Math.floor(Math.random() * tickets.length);
    const winner = tickets[winnerIndex];
    const prizeAmount = winner.amount * 10;

    winner.isWinner = true;
    winner.prizeAmount = prizeAmount;
    await winner.save();

    const user = await User.findById(winner.user);
    if (!user) {
      throw new Error("Winner user not found");
    }

    // Add winning amount to both main and bonus balance using lottery_win type
    await user.addBalanceRecord(prizeAmount, "lottery_win");
    await winner.populate("user", "username");

    res.status(200).json({
      success: true,
      message: winner.lotteryNumber + "is selected as a winner",
      data: winner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to select winner",
      error: error.message,
    });
  }
};

// Delete lottery entry
exports.deleteLottery = async (req, res) => {
  try {
    const { id, lotteryNumber } = req.body;

    const lottery = await Lottery.findOne({ _id: id, lotteryNumber });
    if (!lottery) {
      return res.status(404).json({
        success: false,
        message: "Lottery entry not found",
      });
    }

    // Refund amount to user if ticket wasn't a winner
    if (!lottery.isWinner) {
      const user = await User.findById(lottery.user);
      if (user) {
        await user.addBalanceRecord(lottery.amount, "lottery");
      }
    }

    await lottery.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lottery entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lottery entry",
      error: error.message,
    });
  }
};

// Get weekly winner
exports.getWeeklyWinner = async (req, res) => {
  try {
    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    const winner = await Lottery.findOne({
      weekNumber,
      year,
      isWinner: true,
    }).populate("user", "username");

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "No winner selected yet",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        lotteryNumber: winner.lotteryNumber,
        username: winner.user.username,
        prizeAmount: winner.prizeAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly winner",
      error: error.message,
    });
  }
};
