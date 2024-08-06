const express = require('express');
const LoginController = require('../controllers/LoginController');
const RoutesController = require('../controllers/RoutesController');
const SmsController = require('../controllers/SmsController');
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

// React Routes
router.get('/routes', RoutesController.getRoutes);

// Sms import [BACKEND DATA RETRIVING API]
router.post("/sms/receiveSms", SmsController.receiveSms);

module.exports = router;