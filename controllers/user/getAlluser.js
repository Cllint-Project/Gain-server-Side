const User = require("../../models/User");

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: 'get all users',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
