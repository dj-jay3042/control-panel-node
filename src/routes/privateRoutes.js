const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DashboardRoutes = require('./DashboardRoutes');
const RoutesController = require('../controllers/RoutesController');
const MailController = require('../controllers/MailController');
const SmsController = require('../controllers/SmsController');
const WhatsappController = require('../controllers/WhatsappController');

/*********************************************************************************************
 * Private routes 
 *********************************************************************************************/

// Protected routes
router.use(authMiddleware);

router.use(DashboardRoutes);

// MenuItems routes
router.post("/getMenuItems", RoutesController.getMenuItems);

// Mail routes
router.post("/email/sendEmail", MailController.sendEmail);

// Sms routes [FRONTEND DATA GETTING API]
router.get("/sms/getSms", SmsController.getSms);

// Sms import [BACKEND DATA RETRIVING API]
router.post("/sms/receiveSms", SmsController.receiveSms);

// Whatsapp messages
router.post("/whatsapp/send", WhatsappController.sendMessage);

module.exports = router;