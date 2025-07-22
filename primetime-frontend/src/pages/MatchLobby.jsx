import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Card from "../Components/Card";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import nineteen from "../assets/images/nineteen.svg"; // Import the images
import five from "../assets/images/five.svg";
import eleven from "../assets/images/eleven.svg";
import three from "../assets/images/three.svg"; // New imports
import yellowPlus from "../assets/images/yellowplus.svg";
import greenPlus from "../assets/images/greenplus.svg";
import seven from "../assets/images/seven.svg";
import two from "../assets/images/two.svg";
import thirteen from "../assets/images/thirteen.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

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
  const swiperRef = useRef(null);
  const { gameCode: urlGameCode } = useParams();
  const [gameCode] = useState(
    urlGameCode || localStorage.getItem("gameCode") || ""
  );
  const [playerId, setPlayerId] = useState(
    localStorage.getItem("playerId") || null
  );
  const [players, setPlayers] = useState([]);
  const [floorCards, setFloorCards] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [stackArray, setStackArray] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [maxPlayers, setMaxPlayers] = useState(null);
  const colorMap = {
    1: "bg-gray-500",
    4: "bg-blue-500",
    6: "bg-green-500",
    8: "bg-purple-500",
    9: "bg-pink-500",
    10: "bg-teal-500",
    12: "bg-yellow-500",
    14: "bg-red-500",
    15: "bg-indigo-500",
    16: "bg-cyan-500",
    18: "bg-lime-500",
    20: "bg-amber-500",
    21: "bg-rose-500",
    22: "bg-emerald-500",
    24: "bg-fuchsia-500",
    25: "bg-violet-500",
    26: "bg-sky-500",
    27: "bg-zinc-500",
    28: "bg-slate-500",
    30: "bg-orange-600",
    32: "bg-blue-600",
    33: "bg-teal-600",
    34: "bg-rose-600",
    35: "bg-yellow-600",
    36: "bg-purple-600",
    38: "bg-pink-600",
    39: "bg-lime-600",
    40: "bg-amber-600",
    42: "bg-indigo-600",
    44: "bg-red-600",
    45: "bg-cyan-600",
    46: "bg-emerald-600",
    48: "bg-fuchsia-600",
    49: "bg-violet-600",
    50: "bg-sky-600",
    51: "bg-zinc-600",
    52: "bg-slate-600",
    54: "bg-orange-700",
    55: "bg-blue-700",
    56: "bg-teal-700",
    57: "bg-rose-700",
    58: "bg-yellow-700",
    60: "bg-purple-700",
  };

  const availableCards = Array.from({ length: 60 }, (_, i) => i + 1);

  const hasPlayablePrimes = () => {
    if (!players[currentPlayerIndex] || currentPlayerIndex === null)
      return false;
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
      fetch(
        `https://primetime-backend-9sbd.onrender.com/api/game/${gameCode}/players`
      )
        .then((res) => res.json())
        .then((data) => setMaxPlayers(data.game.settings.maxPlayers));
    });
    socket.on("gameStarted", (data) =>
      console.log("Game started:", data.message)
    );
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
      {players
        .filter((p) => p.id !== playerId)
        .map((player) => (
          <div
            key={player.id}
            className="bg-white p-3 rounded-lg shadow-md min-w-[120px]"
          >
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
    const currentPlayer = players.find((p) => p.id === playerId);
    if (!currentPlayer) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <img
              src={nineteen}
              alt="Nineteen"
              className="absolute"
              style={{ top: "53px", left: "65px", width: "100px" }}
            />
      
            {/* Image: five.svg */}
            <img
              src={five}
              alt="Five"
              className="absolute"
              style={{ top: "329px", left: "-12px", width: "100px" }}
            />
      
            {/* Image: eleven.svg */}
            <img
              src={eleven}
              alt="Eleven"
              className="absolute"
              style={{ top: "665px", left: "-15px", width: "100px" }}
            />
      
            {/* Image: three.svg */}
            <img
              src={three}
              alt="Three"
              className="absolute"
              style={{ top: "80%", left: "-5px", width: "100px" }}
            />
      
            {/* Image: yellow-plus.svg */}
            <img
              src={yellowPlus}
              alt="Yellow Plus"
              className="absolute"
              style={{ bottom: "0", left: "23px", width: "100px" }}
            />
      
            {/* Image: green-plus.svg */}
            <img
              src={greenPlus}
              alt="Green Plus"
              className="absolute"
              style={{ top: "85px", right: "93px", width: "100px" }}
            />
      
            {/* Image: seven.svg */}
            <img
              src={seven}
              alt="Seven"
              className="absolute"
              style={{ top: "201px", right: "0", width: "100px" }}
            />
      
            {/* Image: two.svg */}
            <img
              src={two}
              alt="Two"
              className="absolute"
              style={{ top: "553px", right: "10px", width: "100px" }}
            />
      
            {/* Image: thirteen.svg */}
            <img
              src={thirteen}
              alt="Thirteen"
              className="absolute"
              style={{ top: "80%", right: "-10px", width: "100px" }}
            />
      
            {/* Image: nineteen.svg (bottom right) */}
            <img
              src={nineteen}
              alt="Nineteen"
              className="absolute"
              style={{ bottom: "0", right: "25px", width: "100px" }}
            />
      
        <div className="relative">
          <Swiper
            ref={swiperRef}
            slidesPerView={5}
            slidesPerGroup={1}
            spaceBetween={16} // Increased space between cards
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            // Remove breakpoints to maintain exactly 5 cards visible
            className="!overflow-visible" // Allow cards to extend beyond container
          >
            {currentPlayer.cards.map((card, index) => {
              const isPlayable =
                currentPlayerIndex ===
                  players.findIndex((p) => p.id === playerId) &&
                isCardPlayable(card);
              const isPrime = [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
              ].includes(card);

              const bgColor = isPrime
                ? "bg-orange-500"
                : colorMap[card] || "bg-gray-500";

              return (
                <SwiperSlide key={index} className="!w-[20%]">
                  {" "}
                  {/* Each slide takes exactly 20% width */}
                  <div
                    className={`relative flex flex-col items-center justify-center h-28 w-20 rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 mx-1 ${
                      isPlayable ? "" : "opacity-60"
                    }`}
                    onClick={isPlayable ? () => playCard(index) : undefined}
                  >
                    {/* Card background with rays */}
                    <div
                      className="absolute inset-0 bg-white"
                      style={{
                        backgroundImage:
                          "repeating-conic-gradient(transparent 0deg, transparent 15deg, rgba(0,0,0,0.05) 15deg, rgba(0,0,0,0.05) 30deg)",
                        transform: "rotate(45deg)",
                        zIndex: 0,
                      }}
                    ></div>

                    {/* Main card color */}
                    <div
                      className={`absolute bottom-0 h-3 w-full ${bgColor} rounded-b-lg z-10`}
                    ></div>

                    {/* Number circle - made larger */}
                    <div
                      className={`relative flex items-center justify-center h-10 w-10 ${bgColor} rounded-full text-white text-base font-bold shadow-md border-2 border-white z-10`}
                    >
                      {card}
                    </div>

                    {/* Playable indicator - made slightly larger */}
                    {isPlayable && (
                      <div className="absolute top-1 right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-20">
                        ✓
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation buttons - positioned closer to the cards */}
          <button className="swiper-button-prev absolute left-0 bottom-0  z-20 bg-orange-200 hover:bg-orange-600 rounded-full p-1 w-8 h-8 flex items-center justify-center shadow-lg">
            
          </button>
          <button className="swiper-button-next absolute right-0 bottom-0 z-20 bg-orange-200 hover:bg-orange-600 rounded-full p-1 w-8 h-8 flex items-center justify-center shadow-lg">
            
          </button>
        </div>

        {/* Pass turn button remains the same */}
        {currentPlayerIndex === players.findIndex((p) => p.id === playerId) &&
          !hasPlayablePrimes() && (
            <button
              onClick={() => socket.emit("passTurn", { gameCode, playerId })}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>Pass Turn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#124d68]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">
            Game Code: {gameCode}
          </h1>
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
                <Card
                  number={card}
                  label={floorCards.includes(card) ? "ON FLOOR" : ""}
                />
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
