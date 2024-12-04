const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, phoneNumber, password, referralCode, profileImage } = req.body;
    
    if(!username || !phoneNumber || !password || !referralCode || !profileImage) {
      return res.status(400).json({
        message: "Please fill all inputs",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this username or phone number",
      });
    }

    const newUser = new User({
      username,
      phoneNumber,
      password,
      profileImage,
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }

      newUser.referredBy = referrer._id;
      await newUser.addBalanceRecord(60, 'referral');

      referrer.referralCount += 1;
      await referrer.save();
    }

    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    const populatedUser = await User.findById(newUser._id)
      .populate("referredBy", "username referralCode");

    res.status(201).json({
      success: true,
      data: {
        _id: populatedUser._id,
        username: populatedUser.username,
        role: populatedUser.role,
        profileImage: populatedUser.profileImage,
        token,
        todayBonus: populatedUser.todayBonus,
        todayBalance: populatedUser.todayBalance,
        balance: populatedUser.balance,
        bonus_balance: populatedUser.bonus_balance
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

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber }).populate(
      "referredBy",
      "username referralCode"
    );

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      data: {
        _id: user._id,
        role: user.role,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
        token,
        todayBonus: user.todayBonus,
        todayBalance: user.todayBalance,
        balance: user.balance,
        bonus_balance: user.bonus_balance
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -balanceHistory")
      .populate("referredBy", "username referralCode");
      
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      success: true,
      data: {
        ...user.toObject(),
        todayBonus: user.todayBonus,
        todayBalance: user.todayBalance
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};