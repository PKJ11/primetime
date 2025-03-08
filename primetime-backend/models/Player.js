const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gameCode: { type: String, required: true }, // The game code the player is joining
  score: { type: Number, default: 0 }, // Player's score
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Player", playerSchema);