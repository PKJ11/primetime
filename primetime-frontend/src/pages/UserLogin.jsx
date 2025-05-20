import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import primetimeLogo from "../assets/images/primetimelogo.svg";
import nineteen from "../assets/images/nineteen.svg";
import five from "../assets/images/five.svg";
import eleven from "../assets/images/eleven.svg";
import three from "../assets/images/three.svg";
import yellowPlus from "../assets/images/yellowplus.svg";
import greenPlus from "../assets/images/greenplus.svg";
import seven from "../assets/images/seven.svg";
import two from "../assets/images/two.svg";
import thirteen from "../assets/images/thirteen.svg";

// Replace the current socket initialization with this:
const socket = io('wss://primetimebackendapis.vercel.app', {
  path: '/socket.io',
  transports: ['websocket'],
  secure: true,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  rejectUnauthorized: false // Only for development
});

const UserLogin = () => {
  const [playerName, setPlayerName] = useState("");
  const [grade, setGrade] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName || !gameCode) {
      setError("Please enter a name and game code");
      return;
    }
    console.log("hello")

    // Join game via Socket.IO
    socket.emit("joinGame", { gameCode, playerName, grade });
    console.log("hello2")

    // Listen for player ID assignment and redirect
    socket.once("assignPlayerId", (playerId) => {
      console.log("hello from socket ")
      localStorage.setItem("playerName", playerName);
      localStorage.setItem("gameCode", gameCode);
      localStorage.setItem("playerId", playerId);
      navigate(`/game-lobby/${gameCode}`);
    });
    console.log("hello3")

    // Handle errors
    socket.once("error", (msg) => {
      console.log("error",msg)
      setError(msg);
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#134E68] overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 w-[180px] sm:w-[220px] md:w-[284px] mb-6">
        <img src={primetimeLogo} alt="Prime Time Logo" className="w-full" />
      </div>

      {/* Decorative Images */}
      <img src={nineteen} alt="Nineteen" className="absolute hidden sm:block" style={{ top: "53px", left: "65px", width: "60px" }} />
      <img src={five} alt="Five" className="absolute hidden md:block" style={{ top: "329px", left: "-12px", width: "80px" }} />
      <img src={eleven} alt="Eleven" className="absolute hidden lg:block" style={{ top: "665px", left: "-15px", width: "80px" }} />
      <img src={three} alt="Three" className="absolute hidden md:block" style={{ top: "80%", left: "-5px", width: "80px" }} />
      <img src={yellowPlus} alt="Yellow Plus" className="absolute hidden sm:block" style={{ bottom: "0", left: "23px", width: "80px" }} />
      <img src={greenPlus} alt="Green Plus" className="absolute hidden md:block" style={{ top: "85px", right: "93px", width: "80px" }} />
      <img src={seven} alt="Seven" className="absolute hidden lg:block" style={{ top: "201px", right: "0", width: "80px" }} />
      <img src={two} alt="Two" className="absolute hidden md:block" style={{ top: "553px", right: "10px", width: "80px" }} />
      <img src={thirteen} alt="Thirteen" className="absolute hidden lg:block" style={{ top: "80%", right: "-10px", width: "80px" }} />
      <img src={nineteen} alt="Nineteen" className="absolute hidden sm:block" style={{ bottom: "0", right: "25px", width: "80px" }} />

      {/* Login Form */}
      <div className="bg-white w-full max-w-[780px] mx-4 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[45px] shadow-lg flex flex-col items-center mt-20 sm:mt-24">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-black text-center mb-6 md:mb-[25px] text-[#F36C40]">
          User Login
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-lg sm:text-xl md:text-[30px] text-[#808181]"
          required
        />

        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-lg sm:text-xl md:text-[30px] text-[#808181]"
        >
          <option value="">Select Grade</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
        </select>

        <input
          type="text"
          placeholder="Game Code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value.toUpperCase())}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-lg sm:text-xl md:text-[30px] text-[#808181]"
          required
        />

        <button
          onClick={handleSubmit}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] bg-[#28A8E0] text-white text-lg sm:text-xl md:text-[30px] rounded-2xl md:rounded-[41px] hover:bg-[#2193c7] transition-colors"
        >
          Enter
        </button>

        {error && (
          <p className="text-red-500 text-sm sm:text-base md:text-[20px] mt-3 md:mt-[15px]">
            {error}
          </p>
        )}

        <p className="text-sm sm:text-base md:text-[20px] text-[#808181] mt-3 md:mt-[15px] cursor-pointer hover:text-[#666]">
          Login as admin
        </p>
      </div>
    </div>
  );
};

export default UserLogin;