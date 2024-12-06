const { default: mongoose } = require("mongoose");
const User = require("../../models/User");

exports.getTeamByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find team members (users who were referred by this user)
    const teamMembers = await User.find({ referredBy: userId })
      .select("username phoneNumber balance createdAt profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json({
      userData: user,
      teamMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAdminByIdForUpdate = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "user data rechive",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user
    const user = await User.findOne({ _id: userId }).select("-balanceHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "user data receive",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


exports.getUserBalanceDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Use aggregation to handle array slicing
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } }, 
      {
        $project: {
          balanceHistory: {
            $slice: ["$balanceHistory", skip, limit], 
          },
          totalBalanceHistory: { $size: "$balanceHistory" }, // Count total entries
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No userBalanceHistory data found",
      });
    }

    const userBalanceHistory = result[0].balanceHistory;
    const total = result[0].totalBalanceHistory;

    res.status(200).json({
      success: true,
      message: "userBalanceHistory retrieved successfully",
      data: userBalanceHistory,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
