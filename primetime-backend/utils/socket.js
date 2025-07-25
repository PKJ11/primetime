const socketio = require("socket.io");
const GameState = require("../models/GameState");
const Player = require("../models/Player");
const Game = require("../models/Game");

let io;

const generateDeck = () => {
  const deck = [];
  
  // Add cards according to the specified distribution
  deck.push(1); // 1 - 1 time
  
  // 2 - 4 times
  for (let i = 0; i < 4; i++) deck.push(2);
  
  // 3 - 3 times
  for (let i = 0; i < 3; i++) deck.push(3);
  
  // 4 - 1 time
  deck.push(4);
  
  // 5 - 2 times
  for (let i = 0; i < 2; i++) deck.push(5);
  
  // 6 - 1 time
  deck.push(6);
  
  // 7 - 2 times
  for (let i = 0; i < 2; i++) deck.push(7);
  
  // Other numbers (8-60) - 1 time each
  for (let i = 8; i <= 60; i++) {
    deck.push(i);
  }
  
  return deck;
};

const hasPlayablePrimes = (playerCards, floorCards) => {
  // Must play 1 first if it's not on the floor
  if (!floorCards.includes(1)) {
    return playerCards.includes(1);
  }

  // Check for any prime cards
  return playerCards.some(card => isPrime(card));
};

const passTurnAutomatically = async (gameCode, playerId) => {
  const gameState = await GameState.findOne({ gameCode }).populate("players");
  
  if (gameState.stackArray.length > 0) {
    const playerIndex = gameState.players.findIndex(
      p => p._id.toString() === playerId
    );
    const newCard = gameState.stackArray.shift();
    gameState.players[playerIndex].cards.push(newCard);
    await gameState.players[playerIndex].save();
  }

  gameState.currentPlayerIndex = 
    (gameState.currentPlayerIndex + 1) % gameState.players.length;
  await gameState.save();
  
  // Notify all players
  io.to(gameCode).emit("notification", {
    message: `${gameState.players[playerIndex].name} passed (no playable primes)`
  });

  emitGameState(gameCode);
};

const initSocket = (server) => {
  io = socketio(server, {
    path: "/socket.io", // Explicit path for Vercel compatibility
    cors: {
      origin: [
        "https://primetime-ruby.vercel.app",
        "https://primetime-backend-9sbd.onrender.com/",
      ],
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true, // For better compatibility
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false // Disable cookie if not needed
  });

  // Add WebSocket specific handlers
  io.engine.on("initial_headers", (headers, req) => {
    headers["Access-Control-Allow-Origin"] = "https://primetime-ruby.vercel.app";
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  });

  io.engine.on("headers", (headers, req) => {
    headers["Access-Control-Allow-Origin"] = "https://primetime-ruby.vercel.app";
    headers["Access-Control-Allow-Credentials"] = "true";
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`Room ${room} was created`);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`Socket ${id} has joined room ${room}`);
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    // Add connection state handlers
    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });

    socket.on("error", (err) => {
      console.error(`Socket error for ${socket.id}:`, err);
    });

    // Join a game room
    socket.on("joinGame", async ({ gameCode, playerName, grade }) => {
      socket.join(gameCode);
      console.log(`Player ${socket.id} joined game room: ${gameCode}`);

      const game = await Game.findOne({ code: gameCode }).populate("players");
      if (!game) {
        console.log(`Game ${gameCode} not found`);
        socket.emit("error", "Game not found");
        return;
      }

      if (game.players.length >= game.settings.maxPlayers) {
        console.log(`Game ${gameCode} is full`);
        socket.emit("error", "Game is full");
        return;
      }

      let player = await Player.findOne({ gameCode, name: playerName });
      if (!player) {
        player = new Player({
          name: playerName,
          gameCode,
          grade,
          socketId: socket.id,
          cards: [],
          score: 0,
        });
        await player.save();
        game.players.push(player._id);
        await game.save();
        console.log(`Created new player:`, player);
      } else {
        player.socketId = socket.id;
        await player.save();
        console.log(`Updated existing player with socketId:`, player);
      }

      socket.emit("assignPlayerId", player._id.toString());
      const playerNames = game.players.map((p) => p.name);
      io.to(gameCode).emit("updatePlayers", playerNames);

      console.log(
        `Players in game ${gameCode}: ${game.players.length}/${game.settings.maxPlayers}`
      );
      if (game.players.length === game.settings.maxPlayers && !game.isActive) {
        console.log(`Starting game ${gameCode} automatically`);
        startGame(gameCode);
      }
    });

    // Start the game
    const startGame = async (gameCode) => {
      try {
        const game = await Game.findOne({ code: gameCode }).populate("players");
        if (!game || game.isActive) return;

        const numOfPlayers = game.players.length;
        const initialTotalCards = 5;
        const availableCards = generateDeck(); // Replace the Array.from with this
    const shuffledCards = shuffle([...availableCards]);

        const dealtCards = shuffledCards.slice(
          0,
          numOfPlayers * initialTotalCards
        );
        const stackArray = shuffledCards.slice(
          numOfPlayers * initialTotalCards
        );

        const playersCards = [];

        // Ensure the first player (index 0) gets a 1
        playersCards[0] = [1]; // Start with 1
        const remainingCards = dealtCards.filter((card) => card !== 1); // Remove one 1 from dealtCards
        playersCards[0] = playersCards[0].concat(
          remainingCards.slice(0, initialTotalCards - 1)
        ); // Add 4 more cards

        // Deal cards to remaining players
        for (let i = 1; i < numOfPlayers; i++) {
          playersCards[i] = remainingCards.slice(
            (i - 1) * initialTotalCards + (initialTotalCards - 1),
            i * initialTotalCards + (initialTotalCards - 1)
          );
        }

        // Update player documents
        for (let i = 0; i < numOfPlayers; i++) {
          await Player.findByIdAndUpdate(game.players[i]._id, {
            cards: playersCards[i],
          });
          console.log(`Player ${i + 1} cards:`, playersCards[i]);
        }

        console.log(`Stack array length before save: ${stackArray.length}`);

        const gameState = new GameState({
          gameCode,
          players: game.players.map((p) => p._id),
          scores: new Map(),
          floorCards: [],
          currentPlayerIndex: 0,
          stackArray,
          winner: null,
          gameOver: false,
        });

        await gameState.save();
        console.log(
          `Saved gameState stackArray length: ${gameState.stackArray.length}`
        );

        game.isActive = true;
        await game.save();

        io.to(gameCode).emit("gameStarted", { message: "Game started!" });
        emitGameState(gameCode);
      } catch (err) {
        console.error("Error starting game:", err);
        io.to(gameCode).emit("error", "Failed to start game");
      }
    };
    // Play a card
    socket.on("playCard", async ({ gameCode, playerId, cardIndex }) => {
      try {
        console.log(
          `Received playCard: gameCode=${gameCode}, playerId=${playerId}, cardIndex=${cardIndex}`
        );
        const gameState = await GameState.findOne({ gameCode }).populate(
          "players"
        );
        if (!gameState || gameState.gameOver) {
          console.log("Play rejected: Game not found or over");
          socket.emit("error", "Game not found or over");
          return;
        }

        const playerIndex = gameState.players.findIndex(
          (p) => p._id.toString() === playerId
        );
        if (playerIndex !== gameState.currentPlayerIndex) {
          console.log(
            `Play rejected: Not player ${playerId}'s turn (currentPlayerIndex=${gameState.currentPlayerIndex})`
          );
          socket.emit("error", "Not your turn!");
          return;
        }

        const player = gameState.players[playerIndex];
        const card = player.cards[cardIndex];

        // Auto-pass if no playable primes
    if (!hasPlayablePrimes(player.cards, gameState.floorCards)) {
      console.log(`Player ${playerId} has no playable primes - forcing pass`);
      await passTurnAutomatically(gameCode, playerId);
      return;
    }
        if (!card) {
          console.log("Play rejected: Invalid card index");
          socket.emit("error", "Invalid card index");
          return;
        }

        console.log(`Player ${playerId} hand: ${player.cards}`);
        console.log(`Attempting to play card: ${card}`);

        if (!gameState.floorCards.includes(1) && card !== 1) {
          console.log("Play rejected: Must play 1 first");
          socket.emit("error", "Must play 1 first!");
          return;
        }

        if (
          !isPrime(card) &&
          !areAllPrimeFactorsOnFloor(card, gameState.floorCards)
        ) {
          console.log(
            "Play rejected: Invalid card - prime factors not on floor"
          );
          socket.emit("error", "Invalid card: prime factors not on floor!");
          return;
        }

        player.cards.splice(cardIndex, 1);
        gameState.floorCards.push(card);

        if (gameState.stackArray.length > 0) {
          const newCard = gameState.stackArray.shift();
          player.cards.push(newCard);
          console.log(`Player ${playerId} drew card: ${newCard}`);
        }

        if (player.cards.length === 0) {
          gameState.winner = playerIndex;
          gameState.gameOver = true;
          console.log(`Player ${playerId} won!`);
        } else {
          gameState.currentPlayerIndex =
            (gameState.currentPlayerIndex + 1) % gameState.players.length;
          console.log(
            `Turn passed to player index: ${gameState.currentPlayerIndex}`
          );
        }

        await player.save();
        await gameState.save();
        console.log(
          `Game state updated: floorCards=${gameState.floorCards}, stackArray length=${gameState.stackArray.length}`
        );
        emitGameState(gameCode);
      } catch (err) {
        console.error("Error playing card:", err);
        socket.emit("error", "Failed to play card");
      }
    });

    // Pass turn
    socket.on("passTurn", async ({ gameCode, playerId }) => {
      try {
        const gameState = await GameState.findOne({ gameCode }).populate(
          "players"
        );
        if (!gameState || gameState.gameOver) return;

        const playerIndex = gameState.players.findIndex(
          (p) => p._id.toString() === playerId
        );
        if (playerIndex !== gameState.currentPlayerIndex) {
          socket.emit("error", "Not your turn!");
          return;
        }

        if (gameState.stackArray.length > 0) {
          const newCard = gameState.stackArray.shift();
          gameState.players[playerIndex].cards.push(newCard);
          await gameState.players[playerIndex].save();
        }

        gameState.currentPlayerIndex =
          (gameState.currentPlayerIndex + 1) % gameState.players.length;
        await gameState.save();
        emitGameState(gameCode); // Call emitGameState here to update all players
      } catch (err) {
        console.error("Error passing turn:", err);
        socket.emit("error", "Failed to pass turn");
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      const player = await Player.findOne({ socketId: socket.id });
      if (player) {
        const gameState = await GameState.findOne({
          gameCode: player.gameCode,
        }).populate("players");
        if (gameState && !gameState.gameOver) {
          const playerIndex = gameState.players.findIndex((p) =>
            p._id.equals(player._id)
          );
          if (playerIndex === gameState.currentPlayerIndex) {
            gameState.currentPlayerIndex =
              (gameState.currentPlayerIndex + 1) % gameState.players.length;
            await gameState.save();
            emitGameState(player.gameCode); // Call emitGameState here to update remaining players
          }
        }
      }
    });
  });
};

// Define emitGameState function
const emitGameState = async (gameCode) => {
  const gameState = await GameState.findOne({ gameCode }).populate("players");
  if (!gameState) {
    console.log(`No game state found for ${gameCode}`);
    return;
  }

  const stateToSend = {
    players: gameState.players.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      cards: p.cards,
    })),
    floorCards: gameState.floorCards,
    currentPlayerIndex: gameState.currentPlayerIndex,
    stackArray: gameState.stackArray,
    winner: gameState.winner,
    gameOver: gameState.gameOver,
    currentPlayerHasPlayablePrimes: hasPlayablePrimes(
      gameState.players[gameState.currentPlayerIndex]?.cards || [],
      gameState.floorCards
    )
  };

  console.log(
    `Emitting game state for ${gameCode}, stackArray length: ${stateToSend.stackArray.length}`
  );
  io.to(gameCode).emit("updateGameState", stateToSend);
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
