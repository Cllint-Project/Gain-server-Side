const MainRechargeModel = require("../../models/MainRecharge");

exports.submitRechargeController = async (req, res) => {
  try {
    const data = req.body;
    // console.log(data ,'in submite')
    const user = await MainRechargeModel.create(data);
    // console.log(user ,'in submite')
    res.json({
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
