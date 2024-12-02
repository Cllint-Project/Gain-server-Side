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
    // console.log(req.user._id?.toString(),"..>>>>", data.investor_id?.toString());
    
    // // Check if `req.user._id` matches `investor_id`
    // if (req.user?._id.toString() !==  data?.investor_id?.toString()) {
    //   return res.status(401).json({
    //     message: "Not authorized. Invalid Investor ID.",
    //   });
    // }

    // Find the user
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
      message: 'Package purchased successfully',
      data: {
        package: packagePurchase,
        updatedBalance: updatedUser.balance
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};