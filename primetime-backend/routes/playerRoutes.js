const express = require("express");
const { joinGame, updateScore } = require("../controllers/playerController");
const router = express.Router();

// Join a game
router.post("/join", joinGame);

// Update player score
router.post("/update-score", updateScore);

module.exports = router;