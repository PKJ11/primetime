import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Card from "../Components/Card";

const socket = io("wss://primetime-backend-9sbd.onrender.com", {
  path: "/socket.io",
  transports: ["websocket"],
  secure: true,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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

  const hasPlayablePrimes = () => {
    if (!players[currentPlayerIndex] || currentPlayerIndex === null) return false;
    const currentPlayer = players.find((p) => p.id === playerId);
    if (!currentPlayer) return false;
    if (!floorCards.includes(1)) return currentPlayer.cards.includes(1);
    return currentPlayer.cards.some((card) => isPrime(card));
  };

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
    if (floorCards.length === 0) return card === 1;
    return isPrime(card) || areAllPrimeFactorsOnFloor(card, floorCards);
  };

  const playCard = (cardIndex) => {
    if (gameOver) {
      setErrorMessage("Game is over!");
      return;
    }
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

    socket.on("connect", () => console.log("Connected to server:", socket.id));
    socket.on("assignPlayerId", (id) => {
      setPlayerId(id);
      localStorage.setItem("playerId", id);
    });
    socket.on("updatePlayers", (playerNames) => {
      setJoinedPlayers(playerNames);
      fetch(`https://primetime-backend-9sbd.onrender.com/api/game/${gameCode}/players`)
        .then((res) => res.json())
        .then((data) => setMaxPlayers(data.game.settings.maxPlayers));
    });
    socket.on("gameStarted", (data) => console.log("Game started:", data.message));
    socket.on("updateGameState", (gameState) => {
      setPlayers(gameState.players);
      setFloorCards(gameState.floorCards);
      setCurrentPlayerIndex(gameState.currentPlayerIndex);
      setStackArray(gameState.stackArray);
      setWinner(gameState.winner);
      setGameOver(gameState.gameOver);
    });
    socket.on("error", (msg) => setErrorMessage(msg));

    return () => {
      socket.off("connect");
      socket.off("assignPlayerId");
      socket.off("updatePlayers");
      socket.off("gameStarted");
      socket.off("updateGameState");
      socket.off("error");
    };
  }, [gameCode]);

  const renderOtherPlayers = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {players.filter(p => p.id !== playerId).map(player => (
        <div key={player.id} className="bg-white p-3 rounded-lg shadow-md min-w-[120px]">
          <h3 className="text-center font-bold mb-2">{player.name}</h3>
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://ik.imagekit.io/pratik11/primetimeuser.JPG?updatedAt=1753167372920"
              alt="Player"
              className="h-10 w-10"
            />
            <span className="bg-blue-100 px-2 py-1 rounded-full text-xs font-semibold">
              {player.cards.length} Cards
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCurrentPlayer = () => {
    const currentPlayer = players.find(p => p.id === playerId);
    if (!currentPlayer) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-bold mb-2">Your Cards</h2>
        <div className="grid grid-cols-5 gap-2">
          {currentPlayer.cards.map((card, index) => {
            const isPlayable = currentPlayerIndex === players.findIndex(p => p.id === playerId) && isCardPlayable(card);
            return (
              <button
                key={index}
                className={`p-2 border rounded-md text-center ${isPlayable ? "bg-green-300" : "bg-blue-100"}`}
                onClick={() => playCard(index)}
                disabled={!isPlayable}
              >
                {card}
              </button>
            );
          })}
        </div>
        {currentPlayerIndex === players.findIndex(p => p.id === playerId) && !hasPlayablePrimes() && (
          <button
            onClick={() => socket.emit("passTurn", { gameCode, playerId })}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Pass Turn
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#124d68]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Game Code: {gameCode}</h1>
          {maxPlayers && (
            <p className="text-white">
              Players: {joinedPlayers.length}/{maxPlayers}
              {joinedPlayers.length < maxPlayers && " (Waiting...)"}
            </p>
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {winner !== null && (
            <p className="text-green-500 font-bold">
              Winner: {players[winner]?.name}
            </p>
          )}
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Floor Cards</h2>
          <div className="flex flex-wrap">
            {availableCards.map((card) => (
              <div key={card} className="p-1">
                <Card number={card} label={floorCards.includes(card) ? "ON FLOOR" : ""} />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-medium text-white mb-2">Other Players</h2>
          {renderOtherPlayers()}
        </div>

        {renderCurrentPlayer()}

        <div className="mt-4 flex justify-between text-white">
          <p>Cards in Stack: {stackArray.length}</p>
          {currentPlayerIndex !== null && (
            <p>Current Turn: {players[currentPlayerIndex]?.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimeTime;