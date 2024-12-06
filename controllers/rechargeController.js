const BuyPackageModel = require("../models/BuyPackageModel");
const User = require("../models/User");

exports.submitInvestController = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ _id: data?.investor_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert investment amount to number and validate
    const investmentAmount = Number(data.machine_details.investment_amount);
    if (isNaN(investmentAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment amount",
      });
    }

    // Check if user has sufficient balance
    if (user.balance < investmentAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Check for vipStatus and invest_limit conditions
    if (
      data.machine_details.vipStatus === "vip" &&
      data.machine_details.invest_limit === "3"
    ) {
      if (user.referralCount < 3) {
        return res.status(400).json({
          success: false,
          message:
            "This VIP machine requires at least 3 referrals to purchase.",
        });
      }

      // Check if user has already purchased 3 machines
      const userPurchases = await BuyPackageModel.find({
        investor_id: user._id,
        "machine_details.machine_name": data.machine_details.machine_name,
      });

      if (userPurchases.length >= 3) {
        return res.status(400).json({
          success: false,
          message: "You can only purchase 3 of this VIP machine.",
        });
      }
    }

    // Create the package purchase record
    const packagePurchase = await BuyPackageModel.create(data);

    await user.addBalanceRecord(-investmentAmount, "package"); 

    const updatedUser = await User.findById(user._id);

    res.status(200).json({
      success: true,
      message: "Package purchased successfully",
      data: {
        package: packagePurchase,
        updatedBalance: updatedUser.balance,
        todayBalance: updatedUser.todayBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const aggregation = [
      {
        $match: {
          $or: [
            { investor_name: { $regex: search, $options: "i" } },
            { phone_number: { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: "$investor_id",
          name: { $first: "$investor_name" },
          phone: { $first: "$phone_number" },
          packageCount: { $sum: 1 },
          packages: { $push: "$$ROOT" },
        },
      },
      { $sort: { packageCount: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          users: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const [result] = await BuyPackageModel.aggregate(aggregation);
    const users = result?.users || [];
    const total = result?.metadata[0]?.total || 0;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user packages found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User packages retrieved successfully",
      data: users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user packages",
      error: error.message,
    });
  }
};
