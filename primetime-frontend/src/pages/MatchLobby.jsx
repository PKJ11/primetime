import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const MatchLobby = () => {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [messageInput, setMessageInput] = useState(""); // State for the chat input field
  const [playerName, setPlayerName] = useState(""); // State to store the player's name

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    // Fetch the player's name from local storage or state
    const name = localStorage.getItem("playerName") || "Guest"; // Replace "Guest" with a default name if needed
    setPlayerName(name);

    // Fetch existing players when joining the lobby
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/game/${gameCode}/players`);
        setPlayers(response.data.players);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    fetchPlayers();

    // Debug connection events
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.io connection error:", err);
    });

    // Join the game room
    socket.emit("joinGame", gameCode);
    console.log(`Joined game room: ${gameCode}`);

    // Listen for updates to the player list
    socket.on("updatePlayers", (players) => {
      console.log("Updated players list:", players);
      setPlayers(players);
    });

    // Listen for chat messages
    socket.on("receiveMessage", ({ playerName, message }) => {
      console.log(`Received message from ${playerName}: ${message}`);
      setMessages((prev) => [...prev, { playerName, message }]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [gameCode]);

  // Handle sending a chat message
  const sendMessage = () => {
    if (messageInput.trim()) {
      const socket = io("http://localhost:5000", {
        transports: ["websocket"],
      });

      // Emit the chat message to the backend with the player's name
      socket.emit("sendMessage", {
        gameCode,
        playerName, // Use the actual player name
        message: messageInput,
      });

      // Clear the input field
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Match Lobby</h1>
      <p className="text-lg">Game Code: {gameCode}</p>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Players:</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index} className="text-lg">
              {player}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="mt-8 w-96">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {/* Chat Messages */}
          <div className="h-48 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.playerName}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLobby;