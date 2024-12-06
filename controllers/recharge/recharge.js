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
    const { status, userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== "all") {
      query.recharge_status = status;
    }

    if (userId) {
      query.investor_id = userId;
    }

    const total = await MainRechargeModel.countDocuments(query);
    const recharges = await MainRechargeModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (recharges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recharges data found",
      });
    }
    res.status(200).json({
      success: true,
      message: "recharges retrieved successfully",
      data: recharges,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (status && status !== "all") {
      query.recharge_status = status;
    }

    const total = await MainRechargeModel.countDocuments(query);
    const recharges = await MainRechargeModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (recharges.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recharge data found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recharges retrieved successfully",
      data: recharges,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharges",
      error: error.message,
    });
  }
};
