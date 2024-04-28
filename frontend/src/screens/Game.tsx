import React from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";

const Game = () => {
  const socket = useSocket();

  return (
    <section className="big-container block-space">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <ChessBoard />
        </div>

        <div className="col-span-2">
          <div>
            <h1>Moves</h1>
            <p>Learn more about your different Moves</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
