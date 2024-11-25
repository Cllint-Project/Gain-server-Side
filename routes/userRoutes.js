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
const { submitRechargeController } = require('../controllers/rechargeController');

// router.use(protect);

router.get('/profile', getUserProfile);
router.get('/transactions', getUserTransactions);
router.put('/vip-status', updateVipStatus);


router.post('/invest', InvestController);
router.get('/get-invest-data', getInvestDataController);
router.get('/get-invest-data/:Id', getAInvestDetailsController);
router.post('/submit-recharge', submitRechargeController);

module.exports = router;