require('dotenv').config();
const mongoose = require('mongoose');
const Shape = require('./models/Shape'); // Import the Shape model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🌱 Connected to DB for Seeding...'))
  .catch(err => console.error(err));

// The "Levels" Data
const starterShapes = [
  {
    name: "The Straight Path",
    difficulty: 1,
    category: "linear",
    // SVG Path: Vertical line from (50,10) to (50,90)
    // "M" = Move to, "L" = Line to
    svgPath: "M 50 10 L 50 90" 
  },
  {
    name: "The Horizon",
    difficulty: 2,
    category: "linear",
    // SVG Path: Horizontal line from (10,50) to (90,50)
    svgPath: "M 10 50 L 90 50"
  },
  {
    name: "The Moon Circle",
    difficulty: 5,
    category: "curve",
    // SVG Path: A circle centered at 50,50 with radius 40
    // "A" = Arc command
    svgPath: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10"
  }
];

const seedDB = async () => {
  try {
    // 1. Clear existing shapes so we don't have duplicates
    await Shape.deleteMany({});
    console.log('🧹 Cleared existing shapes.');

    // 2. Insert new shapes
    await Shape.insertMany(starterShapes);
    console.log('✅ Added 3 Starter Levels!');

  } catch (err) {
    console.error('❌ Seeding Error:', err);
  } finally {
    // 3. Disconnect
    mongoose.connection.close();
    console.log('👋 Connection closed.');
  }
};

// Run the function
seedDB();