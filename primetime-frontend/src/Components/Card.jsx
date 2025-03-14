import React from "react";

const Card = ({ number, label }) => {
  const primeNumbers = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59
  ];

  const colorMap = {
    1: "from-gray-300 bg-gray-500",
    4: "from-blue-300 bg-blue-500",
    6: "from-green-300 bg-green-500",
    8: "from-purple-300 bg-purple-500",
    9: "from-pink-300 bg-pink-500",
    10: "from-teal-300 bg-teal-500",
    12: "from-yellow-300 bg-yellow-500",
    14: "from-red-300 bg-red-500",
    15: "from-indigo-300 bg-indigo-500",
    16: "from-cyan-300 bg-cyan-500",
    18: "from-lime-300 bg-lime-500",
    20: "from-amber-300 bg-amber-500",
    21: "from-rose-300 bg-rose-500",
    22: "from-emerald-300 bg-emerald-500",
    24: "from-fuchsia-300 bg-fuchsia-500",
    25: "from-violet-300 bg-violet-500",
    26: "from-sky-300 bg-sky-500",
    27: "from-zinc-300 bg-zinc-500",
    28: "from-slate-300 bg-slate-500",
    30: "from-orange-400 bg-orange-600",
    32: "from-blue-400 bg-blue-600",
    33: "from-teal-400 bg-teal-600",
    34: "from-rose-400 bg-rose-600",
    35: "from-yellow-400 bg-yellow-600",
    36: "from-purple-400 bg-purple-600",
    38: "from-pink-400 bg-pink-600",
    39: "from-lime-400 bg-lime-600",
    40: "from-amber-400 bg-amber-600",
    42: "from-indigo-400 bg-indigo-600",
    44: "from-red-400 bg-red-600",
    45: "from-cyan-400 bg-cyan-600",
    46: "from-emerald-400 bg-emerald-600",
    48: "from-fuchsia-400 bg-fuchsia-600",
    49: "from-violet-400 bg-violet-600",
    50: "from-sky-400 bg-sky-600",
    51: "from-zinc-400 bg-zinc-600",
    52: "from-slate-400 bg-slate-600",
    54: "from-orange-500 bg-orange-700",
    55: "from-blue-500 bg-blue-700",
    56: "from-teal-500 bg-teal-700",
    57: "from-rose-500 bg-rose-700",
    58: "from-yellow-500 bg-yellow-700",
    60: "from-purple-500 bg-purple-700",
  };

  const isPrime = primeNumbers.includes(number);

  const gradientColor = isPrime
    ? "from-orange-300 via-orange-100 to-white"
    : colorMap[number]?.split(" ")[0] || "from-gray-400";

  const bgColor = isPrime
    ? "bg-orange-500"
    : colorMap[number]?.split(" ")[1] || "bg-gray-500";

  const getPrimeFactors = (num) => {
    const factors = [];
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors.push(i);
        num /= i;
      }
    }
    return factors;
  };

  const primeFactors = !isPrime && number > 1 ? getPrimeFactors(number) : [];

  return (
    <div
      className={`relative flex items-center justify-center h-[75px] w-[85px] rounded-lg overflow-hidden bg-white shadow-md`}
    >
      {/* Rays Effect */}
      <div className="absolute inset-0 bg-white" style={{
        backgroundImage: "repeating-conic-gradient(transparent 0deg, transparent 15deg, rgba(0,0,0,0.05) 15deg, rgba(0,0,0,0.05) 30deg)",
        transform: "rotate(45deg)",
        zIndex: 0,
      }}></div>

      

      <div className={`relative flex items-center justify-center h-8 w-8 ${bgColor} rounded-full text-white text-sm font-bold shadow-md border-2 border-white z-10`}>
        {number}
      </div>

      <div className={`absolute bottom-0 h-2 w-full ${bgColor} rounded-b-lg shadow-md z-10`}></div>

      {/* Hover effect */}
      {label === "ON FLOOR" && (
        <div className="absolute top-1 right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[0.6rem] font-bold z-20">
          ✓
        </div>
      )}
    </div>
  );
};


export default Card;
