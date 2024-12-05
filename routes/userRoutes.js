const express = require("express");
const router = express.Router();
// const { protect } = require('../middleware/auth');
const {
  InvestController,
  getInvestDataController,
  getAInvestDetailsController,
} = require("../controllers/userController");
const { submitInvestController, getUserPurchases } = require("../controllers/rechargeController");
const {
  submitRechargeController,
  getRechargeController,
  getAllRechargeController,
  getRechargeLastDataController,
} = require("../controllers/recharge/recharge");
const {
  getTeamByUserId,
  getUserByUserId,
  getAdminByIdForUpdate,
  getSingleUser,
  getUserBalanceDetails,
} = require("../controllers/user/getUserByPhone");
const {
  getMyPackages,
  claimPackageIncome,
} = require("../controllers/Daily-claim/claim");
const {
  getWithdrawals,
  createWithdraw,
  getWithdrawsHistory,
} = require("../controllers/Invest-withdraw/withdrawController");
const couponController = require("../controllers/Coupon/couponController");
const { getAllUser, deleteUser } = require("../controllers/user/getAlluser");
const { updateUserRole } = require("../controllers/user/updateUserRole");
const {
  approveWithdraw,
} = require("../controllers/Invest-withdraw/approveWithWithdraw");
const { approveRecharge } = require("../controllers/recharge/approvedRecharge");
const updateProfile = require("../controllers/user/updateProfile");
const { getAdminUser } = require("../controllers/admin/getAdmin");
const { protect, adminOnly } = require("../middleware/auth");
const { redeemCoupon } = require("../controllers/Coupon/couponServices");

// dashboard admin route
router.get("/getAdmin",protect, getAdminUser);

// invest package
router.post("/invest", protect, adminOnly, InvestController);
router.get("/get-invest-data",protect, getInvestDataController);
router.get("/get-invest-data/:Id",protect, getAInvestDetailsController);


// *************** user route ****************
router.get("/get-recharge-data/:userId", protect,getRechargeController); // *** 
router.get("/get-recharge-LastData/:userId", protect,getRechargeLastDataController); // *** 
router.get("/team/:id", protect, getTeamByUserId); // ***
router.get("/getSingleUser/:userId",protect, getSingleUser); // *** 

// recharge related
router.post("/claim-daily",protect, claimPackageIncome); // **
router.get("/claim-daily/:Investor_id",protect, getMyPackages); // **
// User route to redeem coupon
router.post("/redeem-coupon",protect, redeemCoupon); // **
// invest by user
router.post("/submit-invest", protect, submitInvestController); // **
// recharge
router.post("/submit-recharge", protect, submitRechargeController); // **
//withdraw
router.post("/withdraw",protect, createWithdraw); // **
router.get("/getWithdraw",protect, getWithdrawsHistory); // **

// get user balance details
router.get("/getUserBalanceDetails/:userId",protect, getUserBalanceDetails);

// lottery for user 


// *************** Admin route ***************
router.get("/getUsers", protect, adminOnly, getAllUser); // **
router.delete("/delete-user/:userId", protect, adminOnly, deleteUser); // **
router.get('/user-purchases', protect, adminOnly, getUserPurchases);

router.get("/get-AllRecharge-data",protect, adminOnly,  getAllRechargeController); // **
router.post("/approve-recharge",protect, adminOnly,  approveRecharge); // ***
// withdraw
router.get("/getWithdraw",protect,adminOnly, getWithdrawals); // **
router.put("/admin/withdraw/approve",protect, adminOnly, approveWithdraw); // **
// Admin route to create secret coupon
router.post("/admin/coupon",protect, adminOnly, couponController.createSecretCoupon); // **
// user role update
router.put("/update-role",protect, adminOnly, updateUserRole); // **

// lottery for admin

router.put(
  "/profile",
  protect,
  updateProfile
);
router.get("/getUser/:userId",protect,adminOnly, getAdminByIdForUpdate); // *** admin update profile
module.exports = router;
