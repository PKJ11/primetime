const Player = require("../models/Player");
const Game = require("../models/Game");
const GameState = require("../models/GameState"); // Add this import
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

    if (game.players.length >= game.settings.maxPlayers) {
      console.log("Game is full");
      return res.status(400).json({ error: "Game is full" });
    }

    const player = await Player.findOneAndUpdate(
      { gameCode, socketId: { $exists: false } },
      { socketId: socket.id },
      { new: true }
    );
    console.log("Player created:", player);

    game.players.push(player._id);
    await game.save();
    console.log("Game updated:", game);

    const updatedGame = await Game.findOne({ code: gameCode }).populate("players", "name");
    const players = updatedGame.players.map((player) => player.name);

    const io = getIO();
    io.to(gameCode).emit("updatePlayers", players);
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

    // Update the Player model's score
    player.score = score;
    await player.save();

    // Sync the score with GameState
    const gameState = await GameState.findOne({ gameCode: player.gameCode });
    if (gameState) { // Ensure GameState exists
      gameState.scores.set(playerId, score); // Update the scores Map
      await gameState.save();
    } else {
      console.warn(`GameState not found for gameCode: ${player.gameCode}`);
    }

    // Socket.IO: Notify all players in the game room of the score update
    // Where: After both Player and GameState scores are updated.
    // When: Immediately after saving the score changes to ensure real-time sync.
    // Why: All players need to see the updated score (e.g., for a leaderboard) instantly.
    const io = getIO();
    io.to(player.gameCode).emit("scoreUpdated", { playerId, score });

    res.json({ message: "Score updated successfully", player });
  } catch (err) {
    console.error("Error updating score:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { joinGame, updateScore };