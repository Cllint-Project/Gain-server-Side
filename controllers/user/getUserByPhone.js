const User = require("../../models/User");

exports.getTeamByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const tokenId = req.user._id;
    
    // console.log(tokenId.toString(),"..>>>>", userId.toString());
    if (tokenId.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid token.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find team members (users who were referred by this user)
    const teamMembers = await User.find({ referredBy: userId })
      .select("username phoneNumber balance createdAt profileImage")
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

exports.getUserByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tokenId = req.user._id;
    // console.log(userId,"..>>>>", tokenId);
    if (tokenId.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Not authorized. Invalid token.",
      });
    }

    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "user data rechive",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
