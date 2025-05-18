const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const playerRoutes = require("./routes/playerRoutes");
const { initSocket, getIO } = require("./utils/socket");

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://primetime-ruby.vercel.app',
  'https://primetimebackendapis.vercel.app',
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // Preflight requests

app.use(express.json());

// Database connection
const connectDB = require("./config/db");
connectDB();

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Vercel-specific export
if (process.env.VERCEL) {
  const server = require('http').createServer(app);
  
  // Initialize Socket.IO
  try {
    initSocket(server);
    console.log("Socket.IO initialized successfully");
  } catch (err) {
    console.error("Failed to initialize Socket.IO:", err);
  }

  // Export for Vercel
  module.exports = app; // Export just the Express app for Vercel
} else {
  // Local development
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Initialize Socket.IO
  try {
    initSocket(server);
    console.log("Socket.IO initialized successfully");
  } catch (err) {
    console.error("Failed to initialize Socket.IO:", err);
  }

  // Graceful shutdown
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  function shutDown() {
    console.log("Received shutdown signal...");
    server.close(() => {
      mongoose.connection.close(false, () => process.exit(0));
    });
    const io = getIO();
    if (io) io.close();
  }
}