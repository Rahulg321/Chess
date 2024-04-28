import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const INVALID_MOVE = "invalid_move";

const LandingPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  if (!socket) {
    console.log("connecting to socket");
    return <div>Connecting.....</div>;
  }

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
            Go to Game
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
