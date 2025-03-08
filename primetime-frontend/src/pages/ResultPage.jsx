import React from "react";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const { gameCode } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Game Results</h1>
      <p className="text-lg">Game Code: {gameCode}</p>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Rankings:</h2>
        <ul>
          <li className="text-lg">Player 1 - 100 points</li>
          <li className="text-lg">Player 2 - 80 points</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultPage;