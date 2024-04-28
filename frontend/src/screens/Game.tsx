import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Button from "../components/Button";
import { GAME_OVER, INIT_GAME, INVALID_MOVE, MOVE } from "./LandingPage";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      // we are receving this message from the server
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          console.log("game initialised");
          setChess(new Chess());
          setBoard(chess.board());

        case INVALID_MOVE:
          console.log("An invalid move was made");

        case GAME_OVER:
          console.log("The game is now over");

        case MOVE:
          console.log("A valid move was made");
          const move = message.payload;
          chess.move(move);
      }
    };
  }, [socket]);

  if (!socket) {
    console.log("connecting to socket");
    return <div>Connecting.....</div>;
  }
  return (
    <section className="big-container block-space">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 flex bg-red-200 justify-center">
          <ChessBoard board={board} socket={socket} />
        </div>

        <div className="col-span-2">
          <div>
            <h1>Start Match Right Now</h1>
            <Button
              btnFunc={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
              }}
            >
              Play Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
