"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
        this.currentUser = null;
    }
    addUser(socket) {
        // a new connection was made
        // add to the global state
        this.users.push(socket);
        this.addHandler(socket);
    }
    removerUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("message received", message);
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    this.currentUser = socket;
                    // start a game
                    console.log("starting a game with the new game class");
                    const game = new Game_1.Game(this.pendingUser, this.currentUser);
                    this.games.push(game);
                    this.pendingUser = null;
                    this.currentUser = null;
                }
                else {
                    // if there is no pending user or no one who joined the game previously
                    console.log("adding a pending user");
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                // before we make a move we need to validate whether we have two full players connected
                // make a move
                // figure out black and white
                // find out the current game
                const game = this.games.find((game) => game.participant1 === socket || game.participant2 === socket);
                if (game) {
                    // make a move
                    game.makeMove(socket, message.move);
                }
                else {
                    // there is no such game, meaning we dont have two players connected to make a game
                    console.log("could not find game");
                }
            }
        });
    }
}
exports.GameManager = GameManager;
