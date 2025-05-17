import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const AdminRegistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [school, setSchool] = useState("");
  const [campus, setCampus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://primetime-backend.vercel.app/api/admin/register", {
        name,
        email,
        password,
        school,
        campus,
      });
      alert("Admin registered successfully");
      navigate("/admin-login");
    } catch (error) {
      alert("Registration failed: " + error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#134E68] relative">
      {/* Logo with 25px gap below */}
      <div className="absolute top-10 w-[284px] h-[147px] mb-[25px]">
        <img src={primetimeLogo} alt="Prime Time Logo" className="w-[100%]" />
      </div>

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

      {/* Registration Form */}
      <div className="bg-white w-[780px] p-12 rounded-[45px] shadow-lg flex flex-col items-center  absolute top-60">
        <h1 className="text-[40px] font-[900] text-center mb-[25px] text-[#F36C40]">
          Admin Registration
        </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[45px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[45px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* School Input */}
          <input
            type="text"
            placeholder="School"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[45px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* Campus Input */}
          <input
            type="text"
            placeholder="Campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[45px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[45px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-[644px] h-[83px] p-4 mb-[80px] bg-[#F4F5F6] rounded-[41px] text-[30px] font-['Inter']"
            required
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-[644px] h-[83px] bg-[#28A8E0] text-white text-[40px] font-['Alfa_Slab_One'] rounded-[41px]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;