const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();

/*********************************************************************************************
 * Public routes 
 *********************************************************************************************/

// Login Routes
router.post('/sendOtp', LoginController.sendOtp);
router.post('/login', LoginController.login);

// Email Verification Route
router.post('/verifyEmail', LoginController.sendVerificationMail);
router.get('/verifyEmail/:token', LoginController.verifyEmail);

module.exports = router;