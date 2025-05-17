import React, { useState } from "react";
import axios from "axios";
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

const AdminDashboard = () => {
  const [gameCode, setGameCode] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [grade, setGrade] = useState("");
  const [hintMode, setHintMode] = useState(true);
  const [timerMode, setTimerMode] = useState(false);
  const [timerLimit, setTimerLimit] = useState("");

  const createGame = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://primetime-backend.vercel.app/api/game/create",
        { maxPlayers: numPlayers, duration: timerLimit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGameCode(response.data.gameCode);
    } catch (error) {
      alert("Failed to create game: " + error.response.data.error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#134E68] overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 w-[180px] sm:w-[220px] md:w-[284px] mb-6">
        <img src={primetimeLogo} alt="Prime Time Logo" className="w-full" />
      </div>

      {/* Decorative Images */}
      <img
        src={nineteen}
        alt="Nineteen"
        className="absolute hidden sm:block"
        style={{ top: "53px", left: "65px", width: "60px" }}
      />
      <img
        src={five}
        alt="Five"
        className="absolute hidden md:block"
        style={{ top: "329px", left: "-12px", width: "80px" }}
      />
      <img
        src={eleven}
        alt="Eleven"
        className="absolute hidden lg:block"
        style={{ top: "665px", left: "-15px", width: "80px" }}
      />
      <img
        src={three}
        alt="Three"
        className="absolute hidden md:block"
        style={{ top: "80%", left: "-5px", width: "80px" }}
      />
      <img
        src={yellowPlus}
        alt="Yellow Plus"
        className="absolute hidden sm:block"
        style={{ bottom: "0", left: "23px", width: "80px" }}
      />
      <img
        src={greenPlus}
        alt="Green Plus"
        className="absolute hidden md:block"
        style={{ top: "85px", right: "93px", width: "80px" }}
      />
      <img
        src={seven}
        alt="Seven"
        className="absolute hidden lg:block"
        style={{ top: "201px", right: "0", width: "80px" }}
      />
      <img
        src={two}
        alt="Two"
        className="absolute hidden md:block"
        style={{ top: "553px", right: "10px", width: "80px" }}
      />
      <img
        src={thirteen}
        alt="Thirteen"
        className="absolute hidden lg:block"
        style={{ top: "80%", right: "-10px", width: "80px" }}
      />
      <img
        src={nineteen}
        alt="Nineteen"
        className="absolute hidden sm:block"
        style={{ bottom: "0", right: "25px", width: "80px" }}
      />

      {/* Dashboard Content */}
      <div className="bg-white w-full max-w-[780px] mx-4 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[45px] shadow-lg flex flex-col items-center mt-20 sm:mt-24">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-black text-center mb-6 md:mb-[25px] text-[#F36C40]">
          Admin Control
        </h1>

        <select
          value={numPlayers}
          onChange={(e) => setNumPlayers(e.target.value)}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-base sm:text-lg md:text-[30px] text-gray-600"
        >
          <option value="">Select number of players*</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-base sm:text-lg md:text-[30px] text-gray-600"
        >
          <option value="">Select grade of players*</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
        </select>

        <div className="flex items-center justify-between w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px]">
          <span className="text-base sm:text-lg md:text-[30px] text-gray-600">
            Hint mode
          </span>
          <button
            className={`w-16 sm:w-20 md:w-[80px] h-8 sm:h-9 md:h-[40px] rounded-full text-white text-sm sm:text-base ${
              hintMode ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={() => setHintMode(!hintMode)}
          >
            {hintMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="flex items-center justify-between w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] p-4 mb-6 md:mb-[35px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px]">
          <span className="text-base sm:text-lg md:text-[30px] text-gray-600">
            Timer mode
          </span>
          <button
            className={`w-16 sm:w-20 md:w-[80px] h-8 sm:h-9 md:h-[40px] rounded-full text-white text-sm sm:text-base ${
              timerMode ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={() => setTimerMode(!timerMode)}
          >
            {timerMode ? "ON" : "OFF"}
          </button>
        </div>

        <select
          value={timerLimit}
          onChange={(e) => setTimerLimit(e.target.value)}
          className={`w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] p-4 mb-6 md:mb-[45px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-base sm:text-lg md:text-[30px] text-gray-600 ${
            !timerMode ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!timerMode}
        >
          <option value="">Select Timer Limit</option>
          <option value="30">30 sec</option>
          <option value="60">1 min</option>
          <option value="120">2 min</option>
        </select>

        <button
          onClick={createGame}
          className="w-full max-w-[644px] h-12 sm:h-14 md:h-[70px] bg-[#28A8E0] text-white text-lg sm:text-xl md:text-[40px] font-extrabold rounded-2xl md:rounded-[41px] mt-4 sm:mt-6 md:mt-10 hover:bg-[#2193c7] transition-colors"
        >
          {gameCode ? `Game code ${gameCode} created` : "Create"}
        </button>
      </div>

      {/* Bottom Image */}
      {/* <div className="absolute bottom-0 w-full flex justify-center">
        <img
          src="https://ik.imagekit.io/pratik2002/cardsbundle-removebg-preview.png?updatedAt=1741748631461"
          alt="Cards Bundle"
          className="w-full max-h-32 sm:max-h-40 object-cover"
        />
      </div> */}
    </div>
  );
};

export default AdminDashboard;