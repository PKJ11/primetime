const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  settings: {
    maxPlayers: { type: Number, default: 4 },
    duration: { type: Number, default: 300 }, // in seconds
  },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", gameSchema);