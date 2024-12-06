const User = require("../../models/User");

exports.getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .select('-password');

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
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
    const userId = req.params.userId;

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


