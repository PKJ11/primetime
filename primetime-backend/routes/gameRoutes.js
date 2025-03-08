const express = require("express");
const { createGame, startGame, getGameState, getGamePlayers } = require("../controllers/gameController");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/create",auth, createGame);
router.post("/start", startGame);
router.get("/:gameCode/state", getGameState);
router.get("/:gameCode/players", getGamePlayers);

module.exports = router;