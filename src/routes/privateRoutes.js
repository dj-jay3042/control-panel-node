const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const DataController = require('../controllers/DataController');

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

module.exports = router;