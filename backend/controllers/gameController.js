const Shape = require('../models/Shape');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// @desc    Get all available shapes (levels)
// @route   GET /api/shapes
exports.getShapes = async (req, res) => {
  try {
    const shapes = await Shape.find().sort({ difficulty: 1 }); // Easiest first
    res.status(200).json(shapes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching shapes', error });
  }
};

// @desc    Submit a new game attempt
// @route   POST /api/attempt
exports.submitAttempt = async (req, res) => {
  const { userId, shapeId, isSuccess, accuracyScore, timeTaken, traceData } = req.body;

  try {
    // 1. Save the Attempt
    const attempt = await Attempt.create({
      user: userId,
      shape: shapeId,
      isSuccess,
      accuracyScore,
      timeTaken,
      traceData // This is the big array of coordinates
    });

    // 2. Update User XP if success
    if (isSuccess) {
        // Simple gamification: 10 XP per success
        await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });
    }

    res.status(201).json({ message: 'Attempt saved!', attemptId: attempt._id });
  } catch (error) {
    res.status(500).json({ message: 'Error saving attempt', error });
  }
};