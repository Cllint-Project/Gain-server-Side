const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  getUserTransactions,
  updateVipStatus
} = require('../controllers/userController');

// router.use(protect);

router.get('/profile', getUserProfile);
router.get('/transactions', getUserTransactions);
router.put('/vip-status', updateVipStatus);

module.exports = router;