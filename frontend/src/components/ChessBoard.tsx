import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/LandingPage";

type ChessBoardProps = {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
};

const ChessBoard = ({ board, socket }: ChessBoardProps) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  const makeMove = () => {};

  return (
    <div className="">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex w-full">
            {row.map((square, j) => {
              return (
                <div
                  key={j}
                  className={`w-20 h-20 ${
                    (i + j) % 2 === 0 ? "bg-green-400" : "bg-white"
                  }`}
                  onClick={() => {
                    if (!from) {
                      setFrom(square?.square ? square?.square : null);
                    } else {
                      setTo(square?.square ? square?.square : null);
                      // check if it is a valid move

                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from,
                            to,
                          },
                        })
                      );
                    }

                    console.log("from", from);
                    console.log("to", to);
                  }}
                >
                  <div className="flex w-full items-center text-black justify-center">
                    {square ? square?.type : ""}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
