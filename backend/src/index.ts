import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  // when the connection is first made
  gameManager.addUser(ws);

  ws.on("disconnect", () => {
    gameManager.removerUser(ws);
  });
});
