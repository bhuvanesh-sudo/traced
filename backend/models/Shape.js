const mongoose = require('mongoose');

const ShapeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: Number, required: true }, // 1-10
  svgPath: { type: String, required: true }, // The "Ideal Path" string
  category: { type: String, enum: ['linear', 'curve', 'shape'], default: 'linear' }
});

module.exports = mongoose.model('Shape', ShapeSchema);