import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, INVALID_MOVE, MOVE } from "./messages";

export class Game {
  public participant1: WebSocket | null;
  public participant2: WebSocket | null;
  private startTime: Date;
  private board: Chess;
  private movesCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.participant1 = player1;
    this.participant2 = player2;
    this.startTime = new Date();
    this.board = new Chess();
    this.movesCount = 0;

    // when the game is first started let the both the players know their respective positions
    console.log("a game was initialised");
    this.participant1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.participant2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validate the type of move using zod
    // is the move valid
    if (this.movesCount % 2 === 0 && socket !== this.participant1) {
      console.log("player 2[black] is making a move when it is white turn");
      return;
    }

    if (this.movesCount % 2 === 1 && socket !== this.participant2) {
      console.log("player 1[white] is making a move when it is black turn");
      return;
    }

    try {
      console.log("inside try catch");
      console.log("move is ", move);
      // will throw an error if there was not a valid move
      this.board.move(move);
    } catch (error) {
      // emit a socket message to the frontend
      console.log("did not make a valid move");
      console.log(error);
      this.participant1?.send(
        JSON.stringify({
          INVALID_MOVE,
          payload: {
            update: "could not make move",
          },
        })
      );

      this.participant2?.send(
        JSON.stringify({
          INVALID_MOVE,
          payload: {
            update: "could not make move",
          },
        })
      );
    }

    console.log("successfully made a move");
    this.movesCount++;

    // check if the game is over
    if (this.board.isGameOver()) {
      // emit a game over message to both the parties
      console.log("game is now over");
      this.participant1?.send(
        JSON.stringify({
          GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );

      this.participant2?.send(
        JSON.stringify({
          GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    // emit make move messages to the respective players

    console.log(this.movesCount % 2 === 0);
    if (this.board.moves().length % 2 === 0) {
      // if player one made a move emit a message to player2
      console.log("player 1 made a move");
      this.participant2?.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      // if player two made a move emit a message to player1
      console.log("player 2 made a move");
      this.participant1?.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
  }
}
