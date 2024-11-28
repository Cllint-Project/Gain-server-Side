const User = require("../../models/User");

exports.getTeamByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(userId);
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find team members (users who were referred by this user)
    const teamMembers = await User.find({ referredBy: userId })
      .select("username phoneNumber balance createdAt")
      .sort({ createdAt: -1 });
    console.log(teamMembers);
    res.status(200).json({
      userData: user,
      teamMembers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
