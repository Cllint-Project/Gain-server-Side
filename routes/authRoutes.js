const express = require('express');
const router = express.Router();
const { register, login, getUserById } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/getUserInfo/:id', getUserById);
module.exports = router;