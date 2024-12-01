const BuyPackageModel = require("../../models/BuyPackageModel");
const { ClaimModel } = require("../../models/DailyClaim");
const User = require("../../models/User");
const { calculateClaimAmount } = require("../../utils/claimCalculations");


exports.claimPackageIncome = async (req, res) => {
  try {
    const { investor_id, package_id } = req.body;

    // console.log(req.user._id?.toString(),"..>>>>", investor_id?.toString());
    
    // Check if `req.user._id` matches `investor_id`
    if (req.user._id.toString() !== investor_id?.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid Claim ID.",
      });
    }
    // Find the specific package
    const package = await BuyPackageModel.findOne({ 
      _id: package_id,
      investor_id 
    });

    if (!package) {
      throw new Error('Package not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already claimed today
    const claimRecord = await ClaimModel.findOne({
      investor_id,
      package_id
    });

    let claimAmount = 0;

    if (claimRecord) {
      // Verify if already claimed today
      if (claimRecord.last_claimed >= today) {
        throw new Error('Already claimed today for this package');
      }

      // Check if package duration is over
      if (claimRecord.total_claims >= package.machine_details.investment_duration) {
        throw new Error('Package duration has expired');
      }

      // Calculate claim amount
      const dailyIncome = parseFloat(package.machine_details.daily_income);
      claimAmount = calculateClaimAmount(
        dailyIncome,
        package.machine_details.investment_duration,
        claimRecord.total_claims
      );

      if (claimAmount > 0) {
        // Update claim record
        await ClaimModel.findByIdAndUpdate(claimRecord._id, {
          last_claimed: new Date(),
          $inc: { total_claims: 1 }
        });
      }
    } else {
      // First time claim for this package
      const dailyIncome = parseFloat(package.machine_details.daily_income);
      claimAmount = calculateClaimAmount(
        dailyIncome,
        package.machine_details.investment_duration,
        0
      );

      if (claimAmount > 0) {
        // Create new claim record
        await ClaimModel.create({
          investor_id,
          package_id,
          last_claimed: new Date(),
          total_claims: 1
        });
      }
    }

    if (claimAmount === 0) {
      throw new Error('No claim amount available for this package');
    }

    // Update user balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: investor_id },
      { $inc: { balance: claimAmount } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'Daily income claimed successfully',
      data: {
        claimedAmount: claimAmount,
        newBalance: updatedUser.balance,
        packageId: package_id
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to claim daily income'
    });
  }
};




// exports.claimDailyIncome = async (req, res) => {
//   try {
//     const investor_id = req.params.Invertor_id;

//     // Find all packages for the investor
//     const packages = await BuyPackageModel.find({ investor_id });

//     if (!packages.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No packages found for this investor",
//       });
//     }

//     console.log("check package", packages);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let totalClaimAmount = 0;

//     // Process each package
//     for (const pkg of packages) {
//       // Check if already claimed today
//       const claimRecord = await ClaimModel.findOne({
//         investor_id,
//         package_id: pkg._id,
//       });

//       if (claimRecord) {
//         // Check if already claimed today
//         if (claimRecord.last_claimed >= today) {
//           continue;
//         }

//         // Check if package duration is over
//         if (
//           claimRecord.total_claims >= pkg.machine_details.investment_duration
//         ) {
//           continue;
//         }

//         // Calculate claim amount
//         const dailyIncome = parseFloat(pkg.machine_details.daily_income);
//         const claimAmount = calculateClaimAmount(
//           dailyIncome,
//           pkg.machine_details.investment_duration,
//           claimRecord.total_claims
//         );

//         if (claimAmount > 0) {
//           totalClaimAmount += claimAmount;

//           // Update claim record
//           await ClaimModel.findByIdAndUpdate(claimRecord._id, {
//             last_claimed: new Date(),
//             $inc: { total_claims: 1 },
//           });
//         }
//       } else {
//         // First time claim for this package
//         const dailyIncome = parseFloat(pkg.machine_details.daily_income);
//         const claimAmount = calculateClaimAmount(
//           dailyIncome,
//           pkg.machine_details.investment_duration,
//           0
//         );
//         console.log("first time daily income", claimAmount);
//         if (claimAmount > 0) {
//           totalClaimAmount += claimAmount;

//           // Create new claim record
//           await ClaimModel.create({
//             investor_id,
//             package_id: pkg._id,
//             last_claimed: new Date(),
//             total_claims: 1,
//           });
//         }
//       }
//     }

//     if (totalClaimAmount === 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "No claims available - packages may be expired or already claimed today",
//       });
//     }

//     // Update user balance
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: investor_id },
//       { $inc: { balance: totalClaimAmount } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       throw new Error("User not found");
//     }

//     res.status(200).json({
//       success: true,
//       message: "Daily income claimed successfully",
//       data: {
//         claimedAmount: totalClaimAmount,
//         newBalance: updatedUser.balance,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to claim daily income",
//       error: error.message,
//     });
//   }
// };

exports.getMyPackages = async (req, res) => {
  try {
    const investor_id = req.params.Investor_id;


    // Check if `req.user._id` matches `investor_id`
    if (req.user._id.toString() !== investor_id.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid investor ID.",
      });
    }
    // Find all packages for the investor
    const packages = await BuyPackageModel.find({ investor_id });

    if (!packages.length) {
      return res.status(404).json({
        success: false,
        message: "No packages found for this investor",
      });
    }
    return res.status(200).json({
      success: true,
      message: "get own packages",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to claim daily income",
      error: error.message,
    });
  }
};
