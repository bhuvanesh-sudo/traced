const Shape = require('../models/Shape');
const User = require('../models/User'); 
const Attempt = require('../models/Attempt');

// GET /api/game/shapes
exports.getShapes = async (req, res) => {
  try {
    const shapes = await Shape.find().sort({ difficulty: 1 });
    res.status(200).json(shapes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// GET /api/game/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch users
    const leaders = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('username xp level');
    
    console.log(`Sending ${leaders.length} leaderboard entries`);
    res.status(200).json(leaders);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: 'Leaderboard Error', error: error.message });
  }
};

// POST /api/game/attempt
exports.submitAttempt = async (req, res) => {
  console.log("Received Attempt:", req.body); // DEBUG LOG

  const { userId, shapeId, isSuccess, accuracyScore } = req.body;

  // Validate Input
  if (!userId || !shapeId) {
    console.log("Missing Data");
    return res.status(400).json({ message: 'Missing userId or shapeId' });
  }

  try {
    // Save the Attempt
    await Attempt.create({
      user: userId,
      shape: shapeId,
      isSuccess,
      accuracyScore
    });

    // Update XP 
    let newXP = 0;
    if (isSuccess) {
        
        const safeScore = Number(accuracyScore) || 0;
        const bonusXP = Math.floor(safeScore / 10);
        const xpToAdd = 10 + bonusXP;

        console.log(`Adding ${xpToAdd} XP to User ${userId}`);

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $inc: { xp: xpToAdd } }, 
            { new: true }
        );

        if (!updatedUser) {
           return res.status(404).json({ message: 'User not found in DB' });
        }
        newXP = updatedUser.xp;
    }

    // Send Response
    console.log("Success! New XP:", newXP);
    res.status(201).json({ message: 'Saved', newXP });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
