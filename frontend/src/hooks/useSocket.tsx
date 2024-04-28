import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("websocket server connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("server disconnected");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};