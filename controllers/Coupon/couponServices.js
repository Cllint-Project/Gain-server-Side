const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const { validateUserPackage } = require("./packageChecking");

const createCoupon = async (code, expirationMinutes, adminId) => {
  if (!code) {
    throw new Error("Coupon code is required");
  }

  //   if (expirationMinutes < 1) {
  //     throw new Error("Expiration time must be at least 1 minute");
  //   }

  const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

  const coupon = new Coupon({
    code,
    isSecret: true,
    expiresAt,
    expirationMinutes,
    createdBy: adminId,
  });

  return await coupon.save();
};

const redeemCoupon = async (code, userId) => {
  if (!code) {
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.expiresAt < new Date()) {
    throw new Error("Coupon has expired");
  }

  const hasUsed = coupon.usages.some(
    (usage) => usage.userId.toString() === userId.toString()
  );

  if (hasUsed) {
    throw new Error("You have already used this coupon");
  }

  // Validate user's package requirements
  await validateUserPackage(userId);

  // Update user balance and record coupon usage
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: 40 } },
    { new: true }
  );

  coupon.usages.push({ userId });
  await coupon.save();

  return updatedUser;
};

module.exports = {
  createCoupon,
  redeemCoupon,
};
