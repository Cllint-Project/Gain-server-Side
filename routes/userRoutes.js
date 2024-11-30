const express = require("express");
const router = express.Router();
// const { protect } = require('../middleware/auth');
const {
  InvestController,
  getInvestDataController,
  getAInvestDetailsController,
} = require("../controllers/userController");
const { submitInvestController } = require("../controllers/rechargeController");
const {
  submitRechargeController,
  getRechargeController,
  getAllRechargeController,
} = require("../controllers/recharge/recharge");
const {
  getTeamByUserId,
  getUserByUserId,
} = require("../controllers/user/getUserByPhone");
const {
  getMyPackages,
  claimPackageIncome,
} = require("../controllers/Daily-claim/claim");
const {
  getWithdrawals,
  createWithdraw,
} = require("../controllers/Invest-withdraw/withdrawController");
const couponController = require("../controllers/Coupon/couponController");
const { getAllUser } = require("../controllers/user/getAlluser");
const { updateUserRole } = require("../controllers/user/updateUserRole");
const {
  approveWithdraw,
} = require("../controllers/Invest-withdraw/approveWithWithdraw");
const { approveRecharge } = require("../controllers/recharge/approvedRecharge");
const updateProfile = require("../controllers/user/updateProfile");
const { getAdminUser } = require("../controllers/admin/getAdmin");
const { protect, adminOnly } = require("../middleware/auth");

// dashboard admin route
router.get("/getAdmin", getAdminUser);

// invest package
router.post("/invest", protect, adminOnly, InvestController);
router.get("/get-invest-data", getInvestDataController);
router.get("/get-invest-data/:Id", getAInvestDetailsController);




// *************** user route ****************
router.get("/get-recharge-data", protect,getRechargeController);
router.get("/team/:id", protect, getTeamByUserId);
router.get("/getUser/:userId", getUserByUserId);
// recharge related
router.post("/claim-daily",protect, claimPackageIncome);
router.get("/claim-daily/:Investor_id",protect, getMyPackages);
// User route to redeem coupon
router.post("/redeem-coupon",protect, couponController.redeemUserCoupon);
// invest by user
router.post("/submit-invest", protect, submitInvestController);
// recharge
router.post("/submit-recharge", protect, submitRechargeController);
//withdraw
router.post("/withdraw",protect, createWithdraw);



// *************** Admin route ***************
router.get("/getUsers", protect, adminOnly, getAllUser);
router.get("/get-AllRecharge-data",protect, adminOnly,  getAllRechargeController);
router.post("/approve-recharge",protect, adminOnly,  approveRecharge);
// withdraw
router.get("/getWithdraw",protect, getWithdrawals);
router.put("/admin/withdraw/approve",protect, adminOnly, approveWithdraw);
// Admin route to create secret coupon
router.post("/admin/coupon",protect, adminOnly, couponController.createSecretCoupon);
// user role update
router.put("/update-role",protect, adminOnly, updateUserRole);
router.put(
  "/profile",
  protect, adminOnly,
  updateProfile
  // validate(userUpdateSchema),
);

module.exports = router;
