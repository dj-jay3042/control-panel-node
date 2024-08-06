const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DataController = require('../controllers/DataController');
const RoutesController = require('../controllers/RoutesController');
const MailController = require('../controllers/MailController');
const SmsController = require('../controllers/SmsController');

/*********************************************************************************************
 * Private routes 
 *********************************************************************************************/

// Protected routes
router.use(authMiddleware);

// Dashboard routes
router.get("/dashboard/getVisits", DataController.getVisits);
router.get("/dashboard/getBotVisits", DataController.getBotVisits);
router.get("/dashboard/getVisitorOs", DataController.getVisitorOs);
router.get("/dashboard/getBankBalance", DataController.getBankBalance);

// MenuItems routes
router.post("/getMenuItems", RoutesController.getMenuItems);

// Mail routes
router.post("/email/sendEmail", MailController.sendEmail);

// Sms routes [FRONTEND DATA GETTING API]
router.get("/sms/getSms", SmsController.getSms);

module.exports = router;