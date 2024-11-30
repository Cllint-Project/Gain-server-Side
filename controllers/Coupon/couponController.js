const { redeemCoupon, createCoupon } = require("./couponServices");

const createSecretCoupon = async (req, res) => {
  try {
    const { code, expirationMinutes = 5, adminId } = req.body;
    // const adminId = req.user._id;
    console.log(code, expirationMinutes, adminId);
    const coupon = await createCoupon(code, expirationMinutes, adminId);

    res.status(201).json({
      success: true,
      message: "Secret coupon created successfully",
      data: {
        code: coupon.code,
        expirationMinutes: coupon.expirationMinutes,
        expiresAt: coupon.expiresAt,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create secret coupon",
    });
  }
};

const redeemUserCoupon = async (req, res) => {
  try {
    const { code, userId } = req.body;
    // const userId = req.user._id;
console.log(code, userId,31)
    const updatedUser = await redeemCoupon(code, userId);

    res.status(200).json({
      success: true,
      message: "Coupon redeemed successfully",
      data: {
        newBalance: updatedUser.balance,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to redeem coupon",
    });
  }
};

const couponController = { createSecretCoupon, redeemUserCoupon };

module.exports = couponController;
