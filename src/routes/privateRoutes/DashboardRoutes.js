const express = require('express');
const router = express.Router();
const DataController = require('../../controllers/DataController');

// Dashboard routes

// Get Total Visits
router.get("/getVisits", DataController.getVisits);

// Get Bot Visits
router.get("/getBotVisits", DataController.getBotVisits);

// Get Visitor's Os Details
router.get("/getVisitorOs", DataController.getVisitorOs);

// Get Bank Balance
router.get("/getBankBalance", DataController.getBankBalance);

// Export Router
module.exports = router;