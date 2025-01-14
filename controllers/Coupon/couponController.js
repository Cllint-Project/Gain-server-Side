const Coupon = require("../../models/Coupon");
const { createCoupon, redeemCoupon } = require("./couponServices");

const createSecretCoupon = async (req, res) => {
  try {
    const { code, expirationMinutes = 1,  couponAmount } = req.body;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    console.log(existingCoupon)
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'This coupon code already exists'
      });
    }
    
    const adminId = req.user._id;
    const coupon = await createCoupon(
      code,
      expirationMinutes,
      adminId,
      couponAmount
    );

    
    res.status(201).json({
      success: true,
      message: "Secret coupon created successfully",
      data: {
        code: coupon.code,
        couponAmount: coupon.couponAmount,
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
