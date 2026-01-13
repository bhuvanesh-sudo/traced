const express = require('express');
const router = express.Router();
const { getShapes, submitAttempt } = require('../controllers/gameController');

// Route: /api/game/shapes
router.get('/shapes', getShapes);

// Route: /api/game/attempt
router.post('/attempt', submitAttempt);

module.exports = router;