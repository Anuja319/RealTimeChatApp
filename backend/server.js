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

// Store connected users
const users = new Map();

// Test API route
app.get("/", (req, res) => {
  res.send("Real-Time Chat Server is Running!");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current online users
  socket.emit("online_users", Array.from(users.values()));

  // Register user
  socket.on("join_chat", (username) => {
    if (users.has(socket.id)) {
      return;
    }

    const cleanUsername = String(username || "")
      .trim()
      .slice(0, 20);

    if (!cleanUsername) {
      return;
    }

    // Store user
    users.set(socket.id, cleanUsername);

    console.log(`${cleanUsername} joined the chat`);

    // Confirm registration
    socket.emit("join_success", {
      username: cleanUsername,
    });

    // Send updated online users list
    io.emit("online_users", Array.from(users.values()));

    // Notify other users
    socket.broadcast.emit("user_notification", {
      text: `${cleanUsername} joined the chat`,
    });
  });

  // Receive message
  socket.on("send_message", (data) => {
    const username = users.get(socket.id);
    const text = String(data?.text || "").trim();

    if (!username || !text || text.length > 500) {
      return;
    }

    const message = {
      id: `${Date.now()}-${socket.id}`,
      username,
      text,
      time: new Date().toLocaleTimeString(),
    };

    console.log("New Message:", message);

    // Broadcast message to all connected clients
    io.emit("receive_message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const username = users.get(socket.id);

    if (username) {
      console.log(`${username} disconnected`);

      // Remove disconnected user
      users.delete(socket.id);

      // Update online users
      io.emit("online_users", Array.from(users.values()));

      // Notify remaining users
      io.emit("user_notification", {
        text: `${username} left the chat`,
      });
    }

    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
