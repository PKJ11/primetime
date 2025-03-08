// models/GameState.js
const mongoose = require("mongoose");

const gameStateSchema = new mongoose.Schema({
  gameCode: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  floorCards: [{ type: Number }],
  currentPlayerIndex: { type: Number, default: 0 },
  stackArray: [{ type: Number }],
  winner: { type: String, default: null },
  gameOver: { type: Boolean, default: false },
});

module.exports = mongoose.model("GameState", gameStateSchema);