const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware);

module.exports = router;