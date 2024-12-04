const Lottery = require("../../models/Lottery/LotteryModel");
const User = require("../../models/User");
const { getCurrentWeekNumber } = require("../../utils/getCurrentWeekNumber");

// Submit new lottery ticket
exports.submitLottery = async (req, res) => {
  try {
    const { lotteryNumber, amount } = req.body;
    const userId = req.user._id; // Assuming user is attached by auth middleware
    console.log(lotteryNumber, amount, "lottery");
    // Validate lottery number
    if (!/^\d{4}$/.test(lotteryNumber)) {
      return res.status(400).json({
        success: false,
        message: "Lottery number must be exactly 4 digits",
      });
    }

    // Validate amount
    if (![100, 200, 500].includes(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be 100, 200, or 500",
      });
    }

    // Check if user has enough balance
    const user = await User.findById(userId);
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Get current week number and year
    const currentDate = new Date();
    const weekNumber = getCurrentWeekNumber();
    const year = currentDate.getFullYear();

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

    // Create lottery ticket
    const lottery = await Lottery.create({
      user: userId,
      lotteryNumber,
      amount,
      weekNumber,
      year,
    });

    // Deduct amount from user's balance
    await User.findByIdAndUpdate(userId, {
      $inc: { balance: -amount },
    });

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
    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    const lotteries = await Lottery.find({ weekNumber, year })
      .populate("user", "username")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: lotteries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lottery entries",
      error: error.message,
    });
  }
};

// Get previous week's lottery entries
exports.getPreviousWeekLotteries = async (req, res) => {
  try {
    const currentWeek = getCurrentWeekNumber();
    const year = new Date().getFullYear();
    const previousWeek = currentWeek - 1;

    const lotteries = await Lottery.find({
      weekNumber: previousWeek,
      year,
    })
      .populate("user", "username")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: lotteries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch previous week lottery entries",
      error: error.message,
    });
  }
};

// Select winner for current week
exports.selectWinner = async (req, res) => {
  try {
    const weekNumber = getCurrentWeekNumber();
    const year = new Date().getFullYear();

    // Get all tickets for current week
    const tickets = await Lottery.find({ weekNumber, year, isWinner: false });

    if (tickets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No eligible tickets found for this week",
      });
    }

    // Randomly select winner
    const winnerIndex = Math.floor(Math.random() * tickets.length);
    const winner = tickets[winnerIndex];

    // Update winner status
    winner.isWinner = true;
    await winner.save();

    // Calculate prize amount (e.g., 10x the ticket amount)
    const prizeAmount = winner.amount * 10;

    // Update user balance
    await User.findByIdAndUpdate(winner.user, {
      $inc: { balance: prizeAmount },
    });

    res.status(200).json({
      success: true,
      message: "Winner selected successfully",
      winner: {
        lotteryNumber: winner.lotteryNumber,
        prizeAmount,
      },
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

    // Find the lottery entry by id and lotteryNumber
    const lottery = await Lottery.findOne({
      _id: id,
      lotteryNumber: lotteryNumber,
    });

    // Check if the lottery entry exists
    if (!lottery) {
      return res.status(404).json({
        success: false,
        message: "Lottery entry not found",
      });
    }


    // Refund amount to user if ticket wasn't a winner
    if (!lottery.isWinner) {
      await User.findByIdAndUpdate(lottery.user, {
        $inc: { balance: lottery.amount },  // Refund the lottery amount to the user's balance
      });
    }

    await lottery.deleteOne({
      _id: id,
      lotteryNumber: lotteryNumber,
    });

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

// In your lotteryController.js
exports.getWeeklyWinner = async (req, res) => {
  try {
    const weekNumber = getCurrentWeekNumber(); // Utility function
    const year = new Date().getFullYear();

    const winner = await Lottery.findOne({ weekNumber, year, isWinner: true }).populate('user', 'username');

    if (!winner) {
      return res.status(404).json({ success: false, message: 'No winner selected yet' });
    }

    res.status(200).json({
      success: true,
      data: {
        lotteryNumber: winner.lotteryNumber,
        username: winner.user.username,
        prizeAmount: winner.amount * 10, // Assuming the prize is 10x ticket amount
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch weekly winner', error: error.message });
  }
};

