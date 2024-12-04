const express = require('express');
const { submitLottery, getCurrentWeekLotteries, getPreviousWeekLotteries, selectWinner, deleteLottery, getWeeklyWinner } = require('../controllers/Lottery/lotteryController');
const { protect, adminOnly } = require('../middleware/auth');



const router = express.Router();

// User routes
router.post('/submit',protect, submitLottery);
// In lotteryRoutes.js
router.get('/weekly-winner', getWeeklyWinner);

// Admin routes
router.get('/current-week', protect, adminOnly, getCurrentWeekLotteries);
router.get('/previous-week', protect, adminOnly, getPreviousWeekLotteries);
router.post('/select-winner',protect, adminOnly,  selectWinner);
router.delete('/delete', protect, adminOnly, deleteLottery);

module.exports = router;