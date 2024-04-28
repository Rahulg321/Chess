"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.participant1 = player1;
        this.participant2 = player2;
        this.startTime = new Date();
        this.board = new chess_js_1.Chess();
        this.movesCount = 0;
        // when the game is first started let the both the players know their respective positions
        console.log("a game was initialised");
        this.participant1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.participant2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        var _a, _b, _c, _d, _e, _f;
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
        }
        catch (error) {
            // emit a socket message to the frontend
            console.log("did not make a valid move");
            console.log(error);
            (_a = this.participant1) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                INVALID_MOVE: messages_1.INVALID_MOVE,
                payload: {
                    update: "could not make move",
                },
            }));
            (_b = this.participant2) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                INVALID_MOVE: messages_1.INVALID_MOVE,
                payload: {
                    update: "could not make move",
                },
            }));
        }
        console.log("successfully made a move");
        this.movesCount++;
        // check if the game is over
        if (this.board.isGameOver()) {
            // emit a game over message to both the parties
            console.log("game is now over");
            (_c = this.participant1) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify({
                GAME_OVER: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            (_d = this.participant2) === null || _d === void 0 ? void 0 : _d.send(JSON.stringify({
                GAME_OVER: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        // emit make move messages to the respective players
        console.log(this.movesCount % 2 === 0);
        if (this.board.moves().length % 2 === 0) {
            // if player one made a move emit a message to player2
            console.log("player 1 made a move");
            (_e = this.participant2) === null || _e === void 0 ? void 0 : _e.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            // if player two made a move emit a message to player1
            console.log("player 2 made a move");
            (_f = this.participant1) === null || _f === void 0 ? void 0 : _f.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
    }
}
exports.Game = Game;
