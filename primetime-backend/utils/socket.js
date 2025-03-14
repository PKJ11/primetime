const socketio = require("socket.io");
const GameState = require("../models/GameState");

let io;

const initSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle joining a game room
    socket.on("joinGame", (gameCode) => {
      socket.join(gameCode);
      console.log(`Player joined game room: ${gameCode}`);
      socket.emit("assignPlayerId", socket.id); // Assign a unique player ID
    });

    // Handle starting the game
    socket.on("startGame", async (gameCode) => {
      try {
        console.log(`Starting game for room: ${gameCode}`); // Debugging
        const availableCards = Array.from({ length: 60 }, (_, i) => i + 1);
        const shuffledCards = shuffle(availableCards);
        console.log("Shuffled Cards:", shuffledCards); // Debugging

        const numOfPlayers = 5; // Default number of players
        const initialTotalCards = 5; // Default cards per player

        const players = Array.from({ length: numOfPlayers }, () => []);
        for (let i = 0; i < numOfPlayers; i++) {
          players[i] = shuffledCards.slice(
            i * initialTotalCards,
            (i + 1) * initialTotalCards
          );
        }

        const stackArray = shuffledCards.slice(
          numOfPlayers * initialTotalCards,
          shuffledCards.length
        );

        console.log("Players' Cards:", players); // Debugging
        console.log("Stack Array:", stackArray); // Debugging

        const gameState = new GameState({
          gameCode,
          players,
          floorCards: [],
          currentPlayerIndex: 0,
          stackArray,
          winner: null,
          gameOver: false,
        });

        await gameState.save();
        console.log("Game State Saved:", gameState); // Debugging
        io.to(gameCode).emit("updateGameState", gameState); // Ensure this line is executed
      } catch (err) {
        console.error("Error starting game:", err);
      }
    });

    // Handle playing a card
    socket.on("playCard", async ({ gameCode, playerId, cardIndex }) => {
      try {
        console.log(`Playing card in room: ${gameCode}`); // Debugging
        const gameState = await GameState.findOne({ gameCode });
        if (!gameState) {
          console.log("Game not found");
          return;
        }

        console.log("Current Game State Before Playing Card:", gameState); // Debugging

        const playerIndex = gameState.players.findIndex((player) =>
          player.includes(playerId)
        );
        const currentPlayerHand = gameState.players[playerIndex];
        const numberPlayed = currentPlayerHand[cardIndex];

        console.log(`Player ${playerIndex} played card: ${numberPlayed}`); // Debugging

        // Validate the move
        if (!gameState.floorCards.includes(1) && numberPlayed !== 1) {
          io.to(gameCode).emit("error", "Please choose 1!");
          return;
        }

        if (
          !isPrime(numberPlayed) &&
          !areAllPrimeFactorsOnFloor(numberPlayed, gameState.floorCards)
        ) {
          io.to(gameCode).emit("error", "Invalid card chosen!");
          return;
        }

        // Update game state
        const updatedHand = [...currentPlayerHand];
        updatedHand.splice(cardIndex, 1);
        gameState.players[playerIndex] = updatedHand;
        gameState.floorCards.push(numberPlayed);

        // Draw a new card from the stack
        if (gameState.stackArray.length > 0) {
          const newCard = gameState.stackArray.shift();
          updatedHand.push(newCard);
        }

        // Check for a winner
        if (updatedHand.length === 0) {
          gameState.winner = playerIndex;
          gameState.gameOver = true;
        }

        // Update current player
        gameState.currentPlayerIndex =
          (gameState.currentPlayerIndex + 1) % gameState.players.length;

        await gameState.save();
        console.log("Updated Game State After Playing Card:", gameState); // Debugging
        io.to(gameCode).emit("updateGameState", gameState);
      } catch (err) {
        console.error("Error playing card:", err);
      }
    });

    // Handle passing the turn
    socket.on("passTurn", async ({ gameCode, playerId }) => {
      try {
        const gameState = await GameState.findOne({ gameCode });
        if (!gameState) {
          console.log("Game not found");
          return;
        }

        const playerIndex = gameState.players.findIndex((player) =>
          player.includes(playerId)
        );

        // Draw a new card from the stack
        if (gameState.stackArray.length > 0) {
          const newCard = gameState.stackArray.shift();
          gameState.players[playerIndex].push(newCard);
        }

        // Update current player
        gameState.currentPlayerIndex =
          (gameState.currentPlayerIndex + 1) % gameState.players.length;

        await gameState.save();
        io.to(gameCode).emit("updateGameState", gameState);
      } catch (err) {
        console.error("Error passing turn:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// Helper functions
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const areAllPrimeFactorsOnFloor = (num, floorCards) => {
  if (isPrime(num)) return true;
  const primeFactors = getAllPrimeFactors(num);
  return primeFactors.every((factor) => {
    const factorCountOnFloor = floorCards.filter(
      (card) => card === factor
    ).length;
    return (
      factorCountOnFloor >= primeFactors.filter((pf) => pf === factor).length
    );
  });
};

const getAllPrimeFactors = (num) => {
  const factors = [];
  for (let i = 2; i <= num; i++) {
    while (isPrime(i) && num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  return factors;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
