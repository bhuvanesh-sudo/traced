require('dotenv').config();
const mongoose = require('mongoose');
const Shape = require('./models/Shape');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🌱 Connected to DB for Seeding...'))
  .catch(err => console.error(err));

const shapes = [
  // --- EASY ---
  {
    name: "The Straight Path",
    difficulty: 1,
    category: "linear",
    svgPath: "M 50 10 L 50 90" 
  },
  {
    name: "The Horizon",
    difficulty: 1,
    category: "linear",
    svgPath: "M 10 50 L 90 50"
  },
  {
    name: "The Box",
    difficulty: 2,
    category: "shape",
    svgPath: "M 15 15 L 85 15 L 85 85 L 15 85 Z" // Expanded Square
  },

  // --- INTERMEDIATE ---
   {
    name: "The Pyramid",
    difficulty: 3,
    category: "shape",
    svgPath: "M 50 15 L 85 85 L 15 85 Z" // Triangle
  },
  {
    name: "The Thunderbolt",
    difficulty: 4,
    category: "linear",
    // Zig-Zag pattern
    svgPath: "M 20 10 L 80 30 L 20 50 L 80 70 L 20 90" 
  },
  {
    name: "The Moon Circle",
    difficulty: 5,
    category: "curve",
    // Perfect Circle
    svgPath: "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10"
  },
  {
    name: "The Sine Wave",
    difficulty: 4,
    category: "curve",
    // Smooth flowing wave
    svgPath: "M 10 50 Q 30 10 50 50 T 90 50"
  },
  {
    name: "The Castle Walls",
    difficulty: 5,
    category: "linear",
    // Square wave pattern (Good for sharp 90 degree turns)
    svgPath: "M 10 70 L 10 40 L 30 40 L 30 70 L 50 70 L 50 40 L 70 40 L 70 70 L 90 70 L 90 40"
  },
  {
    name: "The Wide Infinity",
    difficulty: 6,
    category: "curve",
    // Much wider loops to prevent overlap error
    svgPath: "M 50 50 C 95 10 95 90 50 50 C 5 10 5 90 50 50"
  },

  // --- HARD ---
   {
    name: "Hero's Heart",
    difficulty: 6,
    category: "curve",
    // Two arcs meeting at bottom
    svgPath: "M 50 30 C 50 10 90 10 90 40 C 90 60 50 90 50 90 C 50 90 10 60 10 40 C 10 10 50 10 50 30"
  },
  {
    name: "The Hypnotic Spiral",
    difficulty: 9,
    category: "curve",
    // 4 loops: Center -> Down(r10) -> Up(r20) -> Down(r30) -> Up(r40)
    svgPath: "M 50 50 A 10 10 0 1 0 50 70 A 20 20 0 1 0 50 30 A 30 30 0 1 0 50 90 A 40 40 0 1 0 50 10"
  },
  {
    name: "Star of Power",
    difficulty: 9,
    category: "shape",
    svgPath: "M 50 10 L 61 40 L 95 40 L 67 60 L 78 90 L 50 75 L 22 90 L 33 60 L 5 40 L 39 40 Z"
  },
  {
    name: "The Circuit Board",
    difficulty: 9,
    // Starts top-left, winds like a snake but with varying lengths
    svgPath: "M 10 10 L 10 50 L 30 50 L 30 20 L 60 20 L 60 80 L 20 80 L 20 60 L 90 60 L 90 10"
  },
  {
    name: "The Lightning Bolt",
    difficulty: 10,
    category: "linear",
    svgPath: "M 40 10 L 60 10 L 30 50 L 70 50 L 40 90"
  },
  {
    name: "The Infinity Knot",
    difficulty: 10,
    // A smooth complex curve using Quadratic Beziers (Q)
    // Starts bottom left, curves up-right, loops down-right, crosses back to top-left
    svgPath: "M 10 80 Q 30 10 50 50 Q 70 90 90 20 L 90 80 Q 70 10 50 50 Q 30 90 10 20"
  }
];

const seedDB = async () => {
  try {
    await Shape.deleteMany({});
    console.log('🧹 Cleared existing shapes.');

    await Shape.insertMany(shapes);
    console.log(`✅ Added ${shapes.length} Exciting Levels!`);

  } catch (err) {
    console.error('❌ Seeding Error:', err);
  } finally {
    mongoose.connection.close();
    console.log('👋 Connection closed.');
  }
};

seedDB();