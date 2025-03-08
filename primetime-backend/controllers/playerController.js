const Player = require("../models/Player");
const Game = require("../models/Game");
const { getIO } = require("../utils/socket");

// Join a game
const joinGame = async (req, res) => {
    const { playerName, gameCode } = req.body;
    console.log("Join game request:", { playerName, gameCode });
  
    try {
      const game = await Game.findOne({ code: gameCode }).populate("players", "name");
      if (!game) {
        console.log("Game not found");
        return res.status(404).json({ error: "Game not found" });
      }
  
      // Check if the game is full
      if (game.players.length >= game.settings.maxPlayers) {
        console.log("Game is full");
        return res.status(400).json({ error: "Game is full" });
      }
  
      // Create a new player
      const player = new Player({ name: playerName, gameCode });
      await player.save();
      console.log("Player created:", player);
  
      // Add the player to the game
      game.players.push(player._id);
      await game.save();
      console.log("Game updated:", game);
  
      // Fetch the updated list of players
      const updatedGame = await Game.findOne({ code: gameCode }).populate("players", "name");
      const players = updatedGame.players.map((player) => player.name);
  
      // Notify all players via Socket.io
      const io = getIO();
      io.to(gameCode).emit("updatePlayers", players); // Emit the full list of players
      console.log(`Emitted updatePlayers event for room ${gameCode}`);
  
      res.status(201).json({ message: "Joined game successfully", player });
    } catch (err) {
      console.error("Join game error:", err);
      res.status(500).json({ error: err.message });
    }
  };

// Update player scores
const updateScore = async (req, res) => {
  const { playerId, score } = req.body;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    player.score = score;
    await player.save();

    // Notify all players via Socket.io
    const io = getIO();
    io.to(player.gameCode).emit("scoreUpdated", { playerId, score });

    res.json({ message: "Score updated successfully", player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { joinGame, updateScore };