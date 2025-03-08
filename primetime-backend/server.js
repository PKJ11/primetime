const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const playerRoutes = require("./routes/playerRoutes");
const { initSocket } = require("./utils/socket");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // Allow connections from the frontend
  credentials: true,
}));
app.use(express.json());

const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/player", playerRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.io
initSocket(server);