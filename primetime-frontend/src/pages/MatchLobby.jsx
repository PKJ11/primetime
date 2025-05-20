import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Card from "../Components/Card";

// Replace the current socket initialization with this:
const socket = io('https://primetimebackendapis.vercel.app', {
  path: '/api/socket.io',
  transports: ['websocket'],
  secure: true,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  rejectUnauthorized: false // Only for development
});

const PrimeTime = () => {
  const { gameCode: urlGameCode } = useParams();
  const [gameCode] = useState(urlGameCode || localStorage.getItem("gameCode") || "");
  const [playerId, setPlayerId] = useState(localStorage.getItem("playerId") || null);
  const [players, setPlayers] = useState([]);
  const [floorCards, setFloorCards] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [stackArray, setStackArray] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [maxPlayers, setMaxPlayers] = useState(null);

  const availableCards = Array.from({ length: 60 }, (_, i) => i + 1);

  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
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

  const areAllPrimeFactorsOnFloor = (num, floorCards) => {
    if (isPrime(num)) return true;
    const primeFactors = getAllPrimeFactors(num);
    return primeFactors.every((factor) => floorCards.includes(factor));
  };

  const isCardPlayable = (card) => {
    if (floorCards.length === 0) return card === 1; // Must play 1 first
    return isPrime(card) || areAllPrimeFactorsOnFloor(card, floorCards);
  };

  const playCard = (cardIndex) => {
    if (gameOver) {
      setErrorMessage("Game is over!");
      console.log("Cannot play: Game is over");
      return;
    }
    console.log(`Playing card at index ${cardIndex} for player ${playerId} in game ${gameCode}`);
    socket.emit("playCard", { gameCode, playerId, cardIndex });
  };

  useEffect(() => {
    if (!gameCode || !playerId) {
      setErrorMessage("Missing game code or player ID!");
      return;
    }

    socket.emit("joinGame", {
      gameCode,
      playerName: localStorage.getItem("playerName"),
      grade: "",
    });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("assignPlayerId", (id) => {
      setPlayerId(id);
      localStorage.setItem("playerId", id);
      console.log("Assigned player ID:", id);
    });

    socket.on("updatePlayers", (playerNames) => {
      setJoinedPlayers(playerNames);
      fetch(`https://primetimebackendapis.vercel.app/api/game/${gameCode}`)
        .then((res) => res.json())
        .then((data) => setMaxPlayers(data.game.settings.maxPlayers));
      console.log("Updated player names:", playerNames);
    });

    socket.on("gameStarted", (data) => {
      console.log("Game started:", data.message);
    });

    socket.on("updateGameState", (gameState) => {
      console.log("Received game state:", gameState);
      setPlayers(gameState.players);
      setFloorCards(gameState.floorCards);
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      setStackArray(gameState.stackArray);
      setWinner(gameState.winner);
      setGameOver(gameState.gameOver);
    });

    socket.on("error", (msg) => {
      setErrorMessage(msg);
      console.log("Error received:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("assignPlayerId");
      socket.off("updatePlayers");
      socket.off("gameStarted");
      socket.off("updateGameState");
      socket.off("error");
    };
  }, [gameCode]);

  console.log("Current playerId:", playerId);
  console.log("Players state:", players);

  return (
    <div className="bg">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md" style={{ backgroundColor: "#124d68" }}>
        <div className="mt-6">
          <div className="mb-4">
            <p className="text-lg font-medium text-white">Game Code: {gameCode}</p>
          </div>

          {maxPlayers && (
            <p className="text-lg font-medium text-white mb-4">
              Players: {joinedPlayers.length}/{maxPlayers}
              {joinedPlayers.length < maxPlayers && " (Waiting for players...)"}
            </p>
          )}

          {errorMessage && (
            <p className="text-red-500 font-medium mb-4">{errorMessage}</p>
          )}
          {winner !== null && (
            <p className="text-green-500 font-bold mb-4">
              Player {winner + 1} won! Congratulations!
            </p>
          )}

          <div className="mb-6 bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Floor Cards</h2>
            <div className="flex flex-wrap">
              {availableCards.map((card, index) => (
                <div key={index} className="p-2">
                  <Card
                    number={card}
                    label={floorCards.includes(card) ? "ON FLOOR" : ""}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, index) => (
              <div key={player.id} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-2">{player.name}</h2>
                <div className="grid grid-cols-5 gap-2">
                  {player.cards.map((card, cardIndex) => {
                    const isPlayable =
                      playerId === player.id &&
                      currentPlayerIndex === index &&
                      isCardPlayable(card);
                    return (
                      <button
                        key={cardIndex}
                        className={`p-2 border rounded-md text-center font-medium ${
                          isPlayable ? "bg-green-300" : "bg-blue-100"
                        }`}
                        onClick={() => playCard(cardIndex)}
                        disabled={!isPlayable}
                      >
                        {card}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-lg font-medium text-white">
            Cards in Stack: {stackArray.length}
          </p>
          {currentPlayerIndex !== null && (
            <p className="mt-4 text-lg font-medium text-white">
              Current Turn: {players[currentPlayerIndex]?.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimeTime;