const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id,role) => {
  // return jwt.sign({ id }, process.env.JWT_SECRET, {
  //   expiresIn: "1d",
  // });
  return jwt.sign(
    { id, role }, // Only _id and role in the token
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};



// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, phoneNumber, password, referralCode, profileImage } =
      req.body;
    
// console.log(req.body)
    if(!username | !phoneNumber | !password| !referralCode |!profileImage){
      return res.status(400).json({
        message: "Please fill all inputs",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this username or phone number",
      });
    }

    // Create new user object (don't save yet)
    const newUser = new User({
      username,
      phoneNumber,
      password,
      profileImage,
    });

    // Handle referral if code is provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      // Set referrer
      newUser.referredBy = referrer._id;
      newUser.balance += 60;

      // Update referrer's stats
      referrer.referralCount += 1;
      // referrer.referralEarnings += 60; // Bonus amount for referral
      // referrer.balance += 60;

      await referrer.save();
    }

    // Save the new user
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.role);

    // Get populated user data
    const populatedUser = await User.findById(newUser._id).populate(
      "referredBy",
      "username referralCode"
    );

    res.status(201).json({
      success: true,
      data: {
        _id: populatedUser._id,
        username: populatedUser.username,
        role: populatedUser.role,
        profileImage: populatedUser.profileImage,
        // phoneNumber: populatedUser.phoneNumber,
        // referralCode: populatedUser.referralCode,
        // referredBy: populatedUser.referredBy,
        token, // JWT token included here
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user and populate referral info
    const user = await User.findOne({ phoneNumber }).populate(
      "referredBy",
      "username referralCode"
    );

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id,user?.role);

    res.json({
      success: true,
      data: {
        _id: user._id,
        role: user.role,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
        // referralCode: user.referralCode,
        // referredBy: user.referredBy,
        // balance: user.balance,
        // referralCount: user.referralCount,
        token, // JWT token included here
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};

// Controller function
exports.getUserById = async (req, res) => {
  try {
    console.log(req.params.id)
    const user = await User.findById(req.params.id).select("-password");
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


