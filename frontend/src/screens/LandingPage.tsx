import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="big-container block-space">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <img
            src="/chess.jpeg"
            alt="Image of chess"
            className="object-cover"
          />
        </div>
        <div className="px-6 py-6 border-red-50 border-l-4">
          <h1 className="mb-4">Play Chess on the #2 Site!!!</h1>
          <button
            className="bg-green-600 px-6 py-2 text-white hover:bg-green-800 transition"
            onClick={() => {
              navigate("/game");
            }}
          >
            Play Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
