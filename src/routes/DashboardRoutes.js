const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

// Dashboard routes
router.get("/dashboard/getVisits", DataController.getVisits);
router.get("/dashboard/getBotVisits", DataController.getBotVisits);
router.get("/dashboard/getVisitorOs", DataController.getVisitorOs);
router.get("/dashboard/getBankBalance", DataController.getBankBalance);

module.exports = router;