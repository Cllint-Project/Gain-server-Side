const User = require("../../models/User");

// Controller to update user role
exports.updateUserRole = async (req, res) => {
  const { newRole, userId } = req.body;

  try {
    
    // Update the user's role
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
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
