const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Health check endpoint
router.get('/', healthController.getHealthStatus);

module.exports = router;
