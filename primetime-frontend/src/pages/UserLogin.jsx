import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import primetimeLogo from "../assets/images/primetimelogo.svg";
import nineteen from "../assets/images/nineteen.svg"; // Import the images
import five from "../assets/images/five.svg";
import eleven from "../assets/images/eleven.svg";
import three from "../assets/images/three.svg"; // New imports
import yellowPlus from "../assets/images/yellowplus.svg";
import greenPlus from "../assets/images/greenplus.svg";
import seven from "../assets/images/seven.svg";
import two from "../assets/images/two.svg";
import thirteen from "../assets/images/thirteen.svg";

const UserLogin = () => {
  const [playerName, setPlayerName] = useState("");
  const [grade, setGrade] = useState("");
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/player/join", {
        playerName,
        grade,
        gameCode,
      });
      localStorage.setItem("playerName", playerName);
      navigate(`/game-lobby/${gameCode}`);
    } catch (error) {
      alert(
        "Failed to join game: " + error.response?.data?.error || "Unknown error"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#134E68] relative">
      <div className="absolute top-10 w-[284px] h-[147px] mb-[25px]">
        <img src={primetimeLogo} alt="Prime Time Logo" className="w-full" />
      </div>

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

      <div className="bg-white w-[780px] p-12 rounded-[45px] shadow-lg flex flex-col items-center  absolute top-60">
        <h1 className="text-[40px] font-[900] text-center mb-[25px] text-[#F36C40]">
          User Login
        </h1>
        <input
          type="text"
          placeholder="Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-[644px] h-[83px] p-4 mb-[35px] bg-[#F4F5F6] rounded-[41px] text-[30px] text-[#808181]"
          required
        />
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-[644px] h-[83px] p-4 mb-[35px] bg-[#F4F5F6] rounded-[41px] text-[30px] text-[#808181]"
          

        >
          <option value="" style={{ maxWidth: "250px" }}>Select Grade</option>
          <option value="Grade 1" style={{ maxWidth: "250px" }}>Grade 1</option>
          <option value="Grade 2" style={{ maxWidth: "250px" }}>Grade 2</option>
          <option value="Grade 3" style={{ maxWidth: "250px" }}>Grade 3</option>
        </select>
        <input
          type="text"
          placeholder="Game Code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          className="w-[644px] h-[83px] p-4 mb-[35px] bg-[#F4F5F6] rounded-[41px] text-[30px] text-[#808181]"
          required
        />
        <button
          onClick={handleSubmit}
          className="w-[644px] h-[83px] bg-[#28A8E0] text-white text-[30px] rounded-[41px]"
        >
          Enter
        </button>
        <p className="text-[20px] text-[#808181] mt-[15px] cursor-pointer">
          Login as admin
        </p>
      </div>

      {/* Bottom Image in a Full-Width Div */}
      <div className="absolute bottom-0 w-full flex justify-center">
        <img
          src="https://ik.imagekit.io/pratik2002/cardsbundle-removebg-preview.png?updatedAt=1741748631461"
          alt="Cards Bundle"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default UserLogin;
