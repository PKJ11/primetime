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

// Enhanced CORS configuration
const allowedOrigins = [
  'https://primetime-ruby.vercel.app',
  'https://primetimebackendapis.vercel.app',
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Database connection
const connectDB = require("./config/db");
connectDB();

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// For Vercel deployment, we need to export the app
if (process.env.VERCEL) {
  // Initialize server without listening when on Vercel
  const server = require('http').createServer(app);
  
  // Initialize Socket.IO
  try {
    initSocket(server);
    console.log("Socket.IO initialized successfully");
    
    // Export for Vercel
    module.exports = {
      handler: app,
      websocket: getIO()
    };
  } catch (err) {
    console.error("Failed to initialize Socket.IO:", err);
    module.exports = app;
  }
} else {
  // Local development - listen on PORT
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Initialize Socket.IO for local development
  try {
    initSocket(server);
    console.log("Socket.IO initialized successfully");
  } catch (err) {
    console.error("Failed to initialize Socket.IO:", err);
  }

  // Handle graceful shutdown for local development
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  function shutDown() {
    console.log("Received shutdown signal, closing server...");
    server.close(() => {
      console.log("HTTP server closed");
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
    const io = getIO();
    if (io) {
      io.close(() => {
        console.log("Socket.IO server closed");
      });
    }
  }
}