const User = require("../../models/User");

// Controller to update user role
exports.updateUserRole = async (req, res) => {
  const { newRole, userId } = req.body;
  // const userId = req.user._id;
  // console.log(userId, newRole);
  try {
    // Check if the requester is an admin
    // const admin = await User.findById(adminId);
    // if (admin.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Only admins can change roles." });
    // }

    // Update the user's role
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // if (user.role !== "admin" || user.role !== "normal-user"){
    //   return res.status(404).json({ message: "Invalid role found" });
    // }

    user.role = newRole;
    await user.save();

    return res.status(200).json({
      message: `User role updated successfully to ${newRole}`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
