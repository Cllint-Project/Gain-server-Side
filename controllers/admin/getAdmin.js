const User = require("../../models/User");

// Get admin user for transactions
const getAdminUser = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" })
      .select("phoneNumber username")
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin user found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching admin user",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminUser,
};
