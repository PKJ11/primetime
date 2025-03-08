import React, { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState([]);

  const createGame = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from local storage
      const response = await axios.post(
        "http://localhost:5000/api/game/create",
        { maxPlayers: 4, duration: 300 },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );
      setGameCode(response.data.gameCode);
    } catch (error) {
      alert("Failed to create game: " + error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <button
        onClick={createGame}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Game
      </button>
      {gameCode && (
        <div className="mt-4">
          <p className="text-lg">Game Code: {gameCode}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;