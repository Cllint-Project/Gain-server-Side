const BuyPackageModel = require("../models/BuyPackageModel");
const User = require("../models/User");

// exports.submitInvestController = async (req, res) => {
//     try {
//       const data = req.body;
//       console.log(data,8)
//       const user = await BuyPackageModel.create(data);
//       res.json({
//         message: 'recharged successfully',
//         // data: user
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

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
    console.log("packagedata", data);
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

    // Create the package purchase record
    const packagePurchase = await BuyPackageModel.create(data);

    // Deduct the investment amount from user's balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: data.investor_id },
      {
        $inc: { balance: -investmentAmount },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Package purchased successfully",
      data: {
        package: packagePurchase,
        updatedBalance: updatedUser.balance,
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
    const limit = 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Aggregate pipeline to group packages by user
    const aggregation = [
      // Match based on search criteria
      {
        $match: {
          $or: [
            { investor_name: { $regex: search, $options: 'i' } },
            { phone_number: { $regex: search, $options: 'i' } }
          ]
        }
      },
      // Group by investor
      {
        $group: {
          _id: '$investor_id',
          name: { $first: '$investor_name' },
          phone: { $first: '$phone_number' },
          packageCount: { $sum: 1 },
          packages: { $push: '$$ROOT' }
        }
      },
      // Sort by package count
      { $sort: { packageCount: -1 } },
      // Get total count
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          users: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await BuyPackageModel.aggregate(aggregation);
    
    const users = result[0].users;
    const totalUsers = result[0].metadata[0]?.total || 0;
    
    res.status(200).json({
      users,
      hasMore: totalUsers > skip + limit
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user packages', 
      error: error.message 
    });
  }
};