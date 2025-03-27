const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gameCode: { type: String, required: true },
  score: { type: Number, default: 0 },
  socketId: { type: String, default: null }, // Map socket.id
  cards: [{ type: Number, default: [] }], // Store player hand
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Player", playerSchema);