import React, { useState, useEffect } from "react";
import primeTimeLogo from "../assets/images/primetimelogo.svg";
import Card from "../Components/Card";

const writeToLogFile = (message) => {
  const logMessage = `${new Date().toISOString()}: ${message}\n`;
  const blob = new Blob([logMessage], { type: "text/plain" });
  const file = new File([blob], "log.txt", { type: "text/plain" });
};

const downloadLogFile = () => {
  let file = localStorage.getItem("logFile");
  const blob = new Blob([file], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "log.txt");
  document.body.appendChild(link);
  link.click();
};

const clearLogFile = () => {
  localStorage.removeItem("logFile");
  console.log("Log file cleared.");
};

const appendToLogFile = (message) => {
  const logMessage = `${new Date().toISOString()}: ${message}\n`;
  const blob = new Blob([logMessage], { type: "text/plain" });
  let existingLogs = localStorage.getItem("logFile");
  if (!existingLogs) {
    existingLogs = "";
  }
  const updatedLogs = existingLogs + logMessage;
  localStorage.setItem("logFile", updatedLogs);
};

const MatchLobby = () => {
  const [players, setPlayers] = useState([]);
  const [floorCards, setFloorCards] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);
  const [winner, setWinner] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [numOfPlayers, setNumOfPlayers] = useState(5);
  const [stackArray, setStackArray] = useState([]);
  const [initialTotalCards, setInitialTotalCards] = useState(5);

  const availableCards = [
    1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
    35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60,
  ];

  const isPrime = (num) => {
    if (num <= 1) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        return false;
      }
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

  const areAllPrimeFactorsOnFloor = (num) => {
    if (isPrime(num)) {
      return true;
    }
    const primeFactors = getAllPrimeFactors(num);

    return primeFactors.every((factor) => {
      const factorCountOnFloor = floorCards.reduce((acc, floorCard) => {
        return availableCards[floorCard] === factor ? acc + 1 : acc;
      }, 0);

      return (
        factorCountOnFloor >= primeFactors.filter((pf) => pf === factor).length
      );
    });
  };

  const getCardFromStack = (currentPlayerIndex) => {
    const updatedHand = players[currentPlayerIndex];
    if (stackArray.length > 0) {
      const updatedStackArray = [...stackArray];
      let card = updatedStackArray.shift();
      updatedHand.push(card);
      setStackArray(updatedStackArray);
    }
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = updatedHand;
    setPlayers(updatedPlayers);
  };

  const playTurn = (indexToRemove, playedHand) => {
    if (gameOver) {
      setErrorMessage("The game is over. Please start a new game.");
      return;
    }
    if (currentPlayerIndex !== playedHand - 1) {
      setErrorMessage(
        `It's not Player ${playedHand}'s turn! Let Player ${
          currentPlayerIndex + 1
        } play the game!!`
      );
      return;
    }

    const currentPlayerHand = players[currentPlayerIndex];
    const numberPlayed = currentPlayerHand[indexToRemove];

    if (!floorCards.includes(0) && numberPlayed !== 1) {
      setErrorMessage("Please choose 1 !");
      return;
    }

    if (!isPrime(numberPlayed) && !areAllPrimeFactorsOnFloor(numberPlayed)) {
      setErrorMessage("Invalid card chosen!");
      return;
    }

    let index;
    for (let i = 0; i < 68; i++) {
      if (availableCards[i] == numberPlayed && !floorCards.includes(i)) {
        index = i;
        break;
      }
    }
    const updatedHand = [...currentPlayerHand];
    setFloorCards([...floorCards, index]);
    updatedHand.splice(indexToRemove, 1);
    if (stackArray.length > 0) {
      const updatedStackArray = [...stackArray];
      let card = updatedStackArray.shift();
      updatedHand.push(card);
      setStackArray(updatedStackArray);
    }
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = updatedHand;
    setPlayers(updatedPlayers);
    const playerName = `Player ${currentPlayerIndex + 1}`;
    const logEntry = `Turn ${playedHand}: ${playerName} played card ${updatedHand[indexToRemove]}\n`;
    appendToLogFile(logEntry);
    setErrorMessage("");
    checkWinCondition(playedHand);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    if (updatedHand.length === 0) {
      setWinner(playedHand);
      const playerName = `Player ${playedHand}`;
      const winLogEntry = `Player ${playerName} won the game!\n`;
      appendToLogFile(winLogEntry);
      setGameOver(true);
    }
  };

  const checkWinCondition = (playedHand) => {
    if (players[playedHand - 1].length === 0) {
      setWinner(playedHand);
      const playerName = `Player ${playedHand}`;
      const logEntry = `Player ${playerName} won the game!\n`;
      appendToLogFile(logEntry);
      setGameOver(true);
      return;
    }
  };

  const belongsToPlayer = (card, playerIndex) => {
    return players[playerIndex].includes(card);
  };

  const canPlayAnyCard = (playerIndex) => {
    const currentPlayerHand = players[playerIndex];
    return currentPlayerHand.some((card) => {
      return isPrime(card) || areAllPrimeFactorsOnFloor(card) || card === 1;
    });
  };

  const startGame = () => {
    if (numOfPlayers < 1 || numOfPlayers > 6) {
      setErrorMessage("Number of players must be in between 1 and 6");
      return;
    }

    if (initialTotalCards < 1 || initialTotalCards > 8) {
      setErrorMessage("Total cards must be in between 1 and 8");
      return;
    }

    const shuffledCards = shuffle(availableCards);
    const maxIndex = initialTotalCards * numOfPlayers - 1;
    const indexOfOne = shuffledCards.indexOf(1);
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    [shuffledCards[indexOfOne], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[indexOfOne],
    ];
    clearLogFile();
    appendToLogFile("Start of the Game !");
    appendToLogFile("");
    setErrorMessage("");
    setWinner(null);

    const hands = Array.from({ length: numOfPlayers }, () => []);

    const cardsPerPlayer = initialTotalCards;
    for (let i = 0; i < numOfPlayers; i++) {
      hands[i] = shuffledCards.slice(
        i * cardsPerPlayer,
        (i + 1) * cardsPerPlayer
      );
    }

    setStackArray(
      shuffledCards.slice(
        numOfPlayers * initialTotalCards,
        shuffledCards.length
      )
    );

    setPlayers(hands);
    setFloorCards([]);
    setGameOver(false);
  };

  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  useEffect(() => {
    for (let i = 0; i < players.length; i++) {
      if (belongsToPlayer(1, i)) {
        setCurrentPlayerIndex(i);
        break;
      }
    }
  }, [players]);
  const playerss = [
    { id: 2, name: "Player 02", cardsLeft: 4, active: false },
    { id: 3, name: "Player 03", cardsLeft: 4, active: false },
    { id: 4, name: "", cardsLeft: 4, active: true },
    { id: 5, name: "Player 05", cardsLeft: 4, active: false },
    { id: 6, name: "Player 06", cardsLeft: 4, active: false },
  ];

  return (
    <div className="bg" style={{ backgroundColor: "#134E68" }}>
      <div
        className="max-w-4xl p-6 rounded-lg shadow-md"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-[952px]">
          <div className="mb-6 bg-white p-4 rounded-lg">
            <img
              src={primeTimeLogo}
              alt="PrimeTime Logo"
              style={{
                width: "120.61px",
                height: "55.96px",
                marginBottom: "20px",
              }}
            />

            <div
              className="flex flex-wrap"
              style={{
                width: "921.56px",
                height: "729.79px",
                position: "relative",
              }}
            >
              {availableCards.map((card, index) => (
                <div key={index} className="p-2">
                  <Card
                    number={card}
                    label={floorCards.includes(index) ? "ON FLOOR" : ""}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className=" p-4 rounded-lg max-w-3xl mx-auto text-white bg-white w-[952px]">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md w-[100%]">
              {playerss.map((player, index) => (
                <div key={player.id} className="flex flex-col items-center">
                  {player.name && (
                    <p className="text-xs text-gray-800 font-bold">
                      {player.name}
                    </p>
                  )}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                      player.active ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <span className="text-white font-bold">👤</span>
                  </div>
                  <div
                    className={`text-xs mt-1 px-2 py-1 rounded-md ${
                      player.active
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {player.cardsLeft} Cards Left
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLobby;
