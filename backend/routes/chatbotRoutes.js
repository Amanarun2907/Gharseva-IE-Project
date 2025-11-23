const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// Chat endpoint - accessible by all authenticated users
router.post('/chat', protect, chat);

module.exports = router;
