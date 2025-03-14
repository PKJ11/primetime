import React from "react";
import logo from "../assets/images/primetimelogo.svg";
import nineteen from "../assets/images/nineteen.svg"; // Import the images
import five from "../assets/images/five.svg";
import eleven from "../assets/images/eleven.svg";
import three from "../assets/images/three.svg"; // New imports
import yellowPlus from "../assets/images/yellowplus.svg";
import greenPlus from "../assets/images/greenplus.svg";
import seven from "../assets/images/seven.svg";
import two from "../assets/images/two.svg";
import thirteen from "../assets/images/thirteen.svg";

const ResultPage = () => {
  return (
    <div className="flex flex-col items-center  h-screen bg-[#134E68] text-white p-4 relative">
      {/* Prime Time Logo */}
      <img
        src={logo}
        alt="Prime Time"
        className="w-[246.61px] h-[111.96px] mb-10"
      />

      {/* Image: nineteen.svg */}
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
      

      {/* Game Code Input Boxes */}
      <div className="flex items-center gap-2 mb-10">
        <span className="text-lg font-bold text-[40px]">Game Code</span>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-md font-bold"
          >
            ⬜
          </div>
        ))}
      </div>

      {/* Result Box */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[780px] h-[800px]">

        {/* Winner Message */}
        <div className="w-[100%] flex items-center justify-center mb-7">
          <div className="bg-[#F36C3F] text-white text-center text-lg font-bold py-6 rounded-md w-[551px] text-[47px] mb-9">
            Congrats! You won!
          </div>
        </div>

        {/* Player Rankings */}
        <div className="grid grid-cols-2  gap-y-6 mt-6 text-center">
          {[
            "Player 1 name",
            "Player 2 name",
            "Player 3 name",
            "Player 4 name",
            "Player 5 name",
          ].map((player, index) => (
            <div
              key={index}
              className={`flex flex-col items-center mb-6 ${
                index === 4 ? "col-span-2" : ""
              }`}
            >
              <div className="bg-[#28A8E0] text-white px-4 py-1 rounded-md font-bold text-[35px]">
                {player}
              </div>
              <div className="bg-[#F36C3F] text-white px-4 py-1 rounded-b-md mt-2 text-[31px]">
                333
              </div>
            </div>
          ))}
        </div>

        {/* Home Button */}
        <div className="w-[100%] flex items-center justify-center mb-7">
        <button className="mt-6  bg-[#28A8E0] text-white font-bold py-2  hover:bg-blue-600 w-[646px] text-[40px] rounded-[25px]">
          Home
        </button>
        </div>
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

export default ResultPage;
