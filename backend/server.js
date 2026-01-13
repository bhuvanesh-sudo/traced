require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const gameRoutes = require('./routes/gameRoutes');
const app = express();

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies


// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('Traced API is Running');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', gameRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});