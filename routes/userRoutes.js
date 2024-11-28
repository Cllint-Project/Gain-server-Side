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
const { submitRechargeController, getRechargeController } = require('../controllers/recharge/recharge');
const { getTeamByUserId } = require('../controllers/user/getUserByPhone');
const { getMyPackages, claimPackageIncome } = require('../controllers/Daily-claim/claim');
const { approveWithdraw } = require('../controllers/Invest-withdraw/approveWithWithdraw');
const { createWithdraw } = require('../controllers/Invest-withdraw/withdrawController');
const couponController = require('../controllers/Coupon/couponController');


// router.use(protect);

router.get('/profile', getUserProfile);
router.get('/transactions', getUserTransactions);
router.put('/vip-status', updateVipStatus);


router.post('/invest', InvestController);
router.get('/get-invest-data', getInvestDataController);
router.get('/get-invest-data/:Id', getAInvestDetailsController);

// invest
router.post('/submit-invest', submitInvestController);

// recharge
router.post('/submit-recharge', submitRechargeController);
router.get('/get-recharge-data', getRechargeController);
// update recharge or invest package
// router.put('/update-recharge', updateRechargeController);

router.get('/team/:id', getTeamByUserId);

// recharge related
router.post('/claim-daily', claimPackageIncome);
router.get('/claim-daily/:Investor_id', getMyPackages);

//withdraw
router.post('/withdraw', createWithdraw);
// Route for admin to approve/reject withdrawal
router.put('/admin/withdraw/approve', approveWithdraw);


// Admin route to create secret coupon
router.post('/admin/coupon', couponController.createSecretCoupon);
// User route to redeem coupon
router.post('/redeem-coupon', couponController.redeemUserCoupon);

module.exports = router;