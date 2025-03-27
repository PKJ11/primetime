const Game = require("../models/Game");
const { getIO } = require("../utils/socket");

// Create a new game
const createGame = async (req, res) => {
  const { maxPlayers, duration } = req.body;
  const adminId = req.admin.id; // Admin ID from JWT

  try {
    // Generate a unique game code
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const game = new Game({
      code: gameCode,
      admin: adminId,
      settings: { maxPlayers, duration },
    });

    await game.save();
    res.status(201).json({ gameCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Start the game
const startGame = async (req, res) => {
  const { gameCode } = req.body;

  try {
    const game = await Game.findOne({ code: gameCode });
    if (!game) return res.status(404).json({ error: "Game not found" });

    game.isActive = true;
    await game.save();

    // Notify all players via Socket.io
    const io = getIO();
    io.to(gameCode).emit("startGame", { message: "The game has started!" });

    res.json({ message: "Game started successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the current game state
const getGameState = async (req, res) => {
  const { gameCode } = req.params;

  try {
    const game = await Game.findOne({ code: gameCode }).populate("players");
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json({ game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Fetch players for a specific game
const getGamePlayers = async (req, res) => {
  const { gameCode } = req.params;

  try {
    const game = await Game.findOne({ code: gameCode }).populate("players", "name");
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const players = game.players.map((player) => player.name);
    res.json({ players });
  } catch (err) {
    console.error("Failed to fetch players:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { createGame, startGame, getGameState ,getGamePlayers };