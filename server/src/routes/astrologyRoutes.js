const express = require('express');
const router = express.Router();
const astrologyController = require('../controllers/astrologyController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Astrology routes
router.get('/zodiac', astrologyController.getZodiacInfo);
router.get('/kundli', astrologyController.getKundli);
router.get('/daily-horoscope', astrologyController.getDailyHoroscope);
router.get('/panchang', astrologyController.getPanchang);

module.exports = router;
