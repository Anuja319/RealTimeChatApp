const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

// Create Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

// Test API route
app.get("/", (req, res) => {
  res.send("Real-Time Chat Server is Running!");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Receive message from client
  socket.on("send_message", (data) => {
    const username = String(data?.username || "").trim();
    const text = String(data?.text || "").trim();

    // Validate message
    if (!username || !text || text.length > 500) {
      return;
    }

    const message = {
      id: `${Date.now()}-${socket.id}`,
      username: username.slice(0, 20),
      text: text,
      time: new Date().toLocaleTimeString(),
    };

    console.log("New Message:", message);

    // Broadcast message to all connected clients
    io.emit("receive_message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
