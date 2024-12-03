const MainRechargeModel = require("../../models/MainRecharge");

exports.submitRechargeController = async (req, res) => {
  try {
    const data = req.body;

    const user = await MainRechargeModel.create(data);
    res.json({
      success: true,
      message: "recharged successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRechargeController = async (req, res) => {
  try {
    const userId = req.params.userId;

    // console.log("Requested User ID:", userId);

    // Fetch user data from the database
    const user = await MainRechargeModel.find({ investor_id: userId });

    if (user.length === 0) {
      // No data found for the given userId
      return res.status(404).json({
        success: false,
        message: "No recharge data found for the specified user ID.",
      });
    }

    // Data found
    res.json({
      success: true,
      message: "Recharge data retrieved successfully.",
      data: user,
    });
  } catch (error) {
    // Handle server-side errors
    console.error("Error fetching recharge data:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

exports.getRechargeLastDataController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await MainRechargeModel.find({ investor_id: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recharge data found for the specified user ID.",
      });
    }

    res.json({
      success: true,
      message: "Recharge data retrieved successfully.",
      data: user[0], // Send the object directly
    });
  } catch (error) {
    console.error("Error fetching recharge data:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

exports.getAllRechargeController = async (req, res) => {
  try {
    const { status } = req?.query;

    let query = {};

    // Add status filter if provided and not 'all'
    if (status && status !== "all") {
      query.recharge_status = status;
    }

    const recharges = await MainRechargeModel.find(query).sort({
      createdAt: -1,
    }); // Sort by newest first

    if (recharges.length === 0) {
      // No data found for the given userId
      return res.status(404).json({
        success: false,
        message: "No recharge data found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "recharges retrieved successfully",
      data: recharges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharges",
      error: error.message,
    });
  }
};
