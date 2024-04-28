import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private currentUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
    this.currentUser = null;
  }

  addUser(socket: WebSocket) {
    // a new connection was made
    // add to the global state
    this.users.push(socket);
    this.addHandler(socket);
  }

  removerUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("message received", message);
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          this.currentUser = socket;
          // start a game
          console.log("starting a game with the new game class");
          const game = new Game(this.pendingUser, this.currentUser);
          this.games.push(game);
          this.pendingUser = null;
          this.currentUser = null;
        } else {
          // if there is no pending user or no one who joined the game previously
          console.log("adding a pending user");
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        // before we make a move we need to validate whether we have two full players connected

        // make a move
        // figure out black and white

        // find out the current game
        const game = this.games.find(
          (game) => game.participant1 === socket || game.participant2 === socket
        );

        if (game) {
          // make a move
          game.makeMove(socket, message.move);
        } else {
          // there is no such game, meaning we dont have two players connected to make a game
          console.log("could not find game");
        }
      }
    });
  }
}
