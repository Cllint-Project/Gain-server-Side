const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, phoneNumber, password, referralCode } = req.body;
console.log(req.body)
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { phoneNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this username or phone number' 
      });
    }

    // Create new user object (don't save yet)
    const newUser = new User({
      username,
      phoneNumber,
      password
    });

    // Handle referral if code is provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }

      // Set referrer
      newUser.referredBy = referrer._id;

      // Update referrer's stats
      referrer.referralCount += 1;
      referrer.referralEarnings += 50; // Bonus amount for referral
      referrer.balance += 50;
      
      await referrer.save();
    }

    // Save the new user
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Get populated user data
    const populatedUser = await User.findById(newUser._id)
      .populate('referredBy', 'username referralCode');

    res.status(201).json({
      success: true,
      data: {
        _id: populatedUser._id,
        username: populatedUser.username,
        phoneNumber: populatedUser.phoneNumber,
        referralCode: populatedUser.referralCode,
        referredBy: populatedUser.referredBy,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user and populate referral info
    const user = await User.findOne({ phoneNumber })
      .populate('referredBy', 'username referralCode');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        balance: user.balance,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login error', 
      error: error.message 
    });
  }
};

// Get referral statistics
exports.getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('referredBy', 'username referralCode');

    const referrals = await User.find({ referredBy: user._id })
      .select('username phoneNumber createdAt');

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        referredBy: user.referredBy,
        referrals
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching referral stats', 
      error: error.message 
    });
  }
};