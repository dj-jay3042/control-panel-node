const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();

// Public routes
router.post('/sendOtp', LoginController.sendOtp);
router.post('/login', LoginController.login);

module.exports = router;