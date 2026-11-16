import { io } from "socket.io-client";

// Create Socket.IO client
const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;
