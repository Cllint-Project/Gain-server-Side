const MainRechargeModel = require("../../models/MainRecharge");

exports.submitRechargeController = async (req, res) => {
  try {
    const data = req.body;
    const tokenId = req?.user?._id;
    // Check if `req.user._id` matches `investor_id`
    if (tokenId?.toString() !== data?.investor_id?.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid Recharger ID.",
      });
    }

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
    const { userId } = req.query;
    const tokenId = req?.user?._id;

    // console.log(tokenId.toString(),"..>>>>", userId.toString());
    if (tokenId.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid token",
      });
    }

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
    const { status, user_id } = req?.query;
    // console.log(req?.user?._id.toString(), "token _id");
    // console.log(user_id, "user _id");

    const tokenId = req?.user?._id;
    // Check if `req.user._id` matches `investor_id`
    if (tokenId?.toString() !== user_id?.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid Recharger ID.",
      });
    }

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
