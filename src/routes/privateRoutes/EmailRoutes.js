const express = require('express');
const router = express.Router();
const MailController = require('../../controllers/MailController');

// Mail routes
router.post("/sendEmail", MailController.sendEmail);
router.post("/fetchEmails", MailController.fetchEmails);

// Export Router
module.exports = router;