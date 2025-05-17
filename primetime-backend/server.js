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
const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true,
// }));
app.use(cors({
  origin: '*'
}))
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO: Initialize real-time communication
try {
  initSocket(server);
  console.log("Socket.IO initialized successfully");
} catch (err) {
  console.error("Failed to initialize Socket.IO:", err);
}

// Handle graceful shutdown
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
  io.close(() => {
    console.log("Socket.IO server closed");
  });
}