const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const { validateUserPackage } = require("./packageChecking");

const createCoupon = async (code, expirationMinutes, adminId, couponAmount) => {
  if (!code) {
    throw new Error("Coupon code is required");
  }

  //   if (expirationMinutes < 1) {
  //     throw new Error("Expiration time must be at least 1 minute");
  //   }

  const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

  const coupon = new Coupon({
    code,
    couponAmount,
    isSecret: true,
    expiresAt,
    expirationMinutes,
    createdBy: adminId,
  });

  return await coupon.save();
};

const redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasUsed = coupon.usages.some(
      (usage) => usage.userId.toString() === userId.toString()
    );

    if (hasUsed) {
      return res.status(400).json({ message: "You have already used this coupon" });
    }

    // Add coupon amount to balance history and update balances
    await user.addBalanceRecord(coupon.couponAmount, 'coupon');

    // Record coupon usage
    coupon.usages.push({ userId });
    await coupon.save();

    res.status(200).json({
      message: "Coupon redeemed successfully",
      user: {
        ...user.toObject(),
        todayBonus: user.getTodayBonus(),
        todayBalance: user.getTodayBalance()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error redeeming coupon", 
      error: error.message 
    });
  }
};
module.exports = {
  createCoupon,
  redeemCoupon,
};
