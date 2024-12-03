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
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId; // userId ঠিকভাবে নিচ্ছি

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user?.role === 'admin') {
      return res.status(404).json({ message: "Admin user cannot be deleted" });
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


