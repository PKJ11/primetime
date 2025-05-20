import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://primetime-backend-9sbd.onrender.com/api/admin/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/admin-dashboard");
    } catch (error) {
      alert("Login failed: " + error.response.data.error);
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

      {/* Login Form */}
      <div className="bg-white w-full max-w-[780px] mx-4 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[45px] shadow-lg flex flex-col items-center mt-20 sm:mt-24">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-black text-center mb-6 md:mb-[25px] text-[#F36C40]">
          Admin Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] p-4 mb-6 sm:mb-8 md:mb-[45px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-lg sm:text-xl md:text-[30px] font-['Inter'] placeholder:text-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] p-4 mb-6 sm:mb-10 md:mb-[80px] bg-[#F4F5F6] rounded-2xl md:rounded-[41px] text-lg sm:text-xl md:text-[30px] font-['Inter'] placeholder:text-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full max-w-[644px] h-12 sm:h-14 md:h-[83px] bg-[#28A8E0] text-white text-lg sm:text-2xl md:text-[40px] font-bold rounded-2xl md:rounded-[41px] hover:bg-[#2193c7] transition-colors"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-sm sm:text-base md:text-[25px] text-gray-500 mt-3 md:mt-4 cursor-pointer hover:text-gray-600">
          Forgot password?
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-between w-full px-4 sm:px-8 md:px-12 mt-6 sm:mt-12 md:mt-[100px] text-sm sm:text-base md:text-[25px] gap-4 sm:gap-0">
          <span className="text-gray-500 cursor-pointer hover:text-gray-600 text-center sm:text-left">
            Enter as user
          </span>
          <span className="text-gray-500 cursor-pointer hover:text-gray-600 text-center sm:text-right">
            Sign up as admin
          </span>
        </div>
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

export default AdminLogin;