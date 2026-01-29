const express = require('express');
const router = express.Router();
const guidanceController = require('../controllers/guidanceController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Guidance routes
router.get('/daily', guidanceController.getDailyGuidance);
router.post('/chat', guidanceController.chat);
router.get('/chat/history', guidanceController.getChatHistory);
router.delete('/chat/history', guidanceController.clearChatHistory);

module.exports = router;
