const MainRechargeModel = require("../../models/MainRecharge");

exports.submitRechargeController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data ,'in submite')
    const user = await MainRechargeModel.create(data);
    // console.log(user ,'in submite')
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
    const { userId } = req.query;
    console.log(userId);

    const user = await MainRechargeModel.find({ investor_id: userId });

    res.json({
      message: "recharged data",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllRechargeController = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Add status filter if provided and not 'all'
    if (status && status !== "all") {
      query.recharge_status = status;
    }

    const recharges = await MainRechargeModel.find(query).sort({
      createdAt: -1,
    }); // Sort by newest first

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
