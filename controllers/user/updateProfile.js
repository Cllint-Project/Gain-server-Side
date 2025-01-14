const User = require("../../models/User");

const updateProfile = async (req, res) => {
  try {
    const { username, phoneNumber, userId, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      status: "success",
      data: user
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating profile"
    });
  }
};

module.exports = updateProfile;