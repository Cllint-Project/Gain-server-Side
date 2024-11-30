const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  getUserTransactions,
  updateVipStatus,
  InvestController,
  getInvestDataController,
  getAInvestDetailsController
} = require('../controllers/userController');
const {submitInvestController } = require('../controllers/rechargeController');
const { submitRechargeController, getRechargeController, getAllRechargeController } = require('../controllers/recharge/recharge');
const { getTeamByUserId, getUserByUserId } = require('../controllers/user/getUserByPhone');
const { getMyPackages, claimPackageIncome } = require('../controllers/Daily-claim/claim');
const {  getWithdrawals, createWithdraw } = require('../controllers/Invest-withdraw/withdrawController');
const couponController = require('../controllers/Coupon/couponController');
const { getAllUser } = require('../controllers/user/getAlluser');
const { updateUserRole } = require('../controllers/user/updateUserRole');
const { approveWithdraw } = require('../controllers/Invest-withdraw/approveWithWithdraw');
const { approveRecharge } = require('../controllers/recharge/approvedRecharge');
const { upload } = require('../utils/updateProfileMiddleware');
const updateProfile = require('../controllers/user/updateProfile');


// router.use(protect);

router.get('/profile', getUserProfile);
router.get('/transactions', getUserTransactions);
router.put('/vip-status', updateVipStatus);

// upload invest
router.post('/invest', InvestController);
router.get('/get-invest-data', getInvestDataController);
router.get('/get-invest-data/:Id', getAInvestDetailsController);

// invest
router.post('/submit-invest', submitInvestController);

// recharge
router.post('/submit-recharge', submitRechargeController);
router.get('/get-recharge-data', getRechargeController);
router.get('/get-AllRecharge-data', getAllRechargeController);
router.post('/approve-recharge', approveRecharge);

// team
router.get('/team/:id', getTeamByUserId);
router.get('/getUser/:userId', getUserByUserId);

// recharge related
router.post('/claim-daily', claimPackageIncome);
router.get('/claim-daily/:Investor_id', getMyPackages);

//withdraw
router.post('/withdraw', createWithdraw);
router.get('/getWithdraw', getWithdrawals);
router.put('/admin/withdraw/approve', approveWithdraw);

// Admin route to create secret coupon
router.post('/admin/coupon', couponController.createSecretCoupon);
// User route to redeem coupon
router.post('/redeem-coupon', couponController.redeemUserCoupon);


// dashboard admin route
router.get("/getUsers", getAllUser)
// user role update
router.put("/update-role", updateUserRole);


router.put(
  '/profile',
  updateProfile
  // validate(userUpdateSchema),
);

module.exports = router;