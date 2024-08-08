const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DashboardRoutes = require('./privateRoutes/DashboardRoutes');
const SmsRoutes = require('./privateRoutes/SmsRoutes');
const MenuRoutes = require('./privateRoutes/MenuRoutes');
const EmailRoutes = require('./privateRoutes/EmailRoutes');
const WhatsappRoutes = require('./privateRoutes/WhatsappRoutes');

/*********************************************************************************************
 * Private routes 
 *********************************************************************************************/

// Authentication Middleware To Velidate The Request
router.use(authMiddleware);

// Dashboard routes
router.use("/dashboard", DashboardRoutes);

// Sms routes
router.use("/sms", SmsRoutes);

// Menu routes
router.use("/menu", MenuRoutes);

// Email routes
router.use("/email", EmailRoutes);

// Whatsapp routes
router.use("/whatsapp", WhatsappRoutes);

// Export Private Router
module.exports = router;