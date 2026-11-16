import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Disconnected");

  const [username, setUsername] = useState("");

  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected:", socket.id);
      setStatus("Connected");
    };

    const handleDisconnect = () => {
      console.log("Disconnected");
      setStatus("Disconnected");
      setJoined(false);
    };

    const handleError = (error) => {
      console.log("Connection error:", error.message);
      setStatus("Connection Failed");
      setJoined(false);
    };

    // Receive messages
    const handleReceiveMessage = (data) => {
      setMessages((previous) => [...previous, data]);
    };

    // Receive online users
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    // Receive notifications
    const handleNotification = (data) => {
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          system: true,
          text: data.text,
        },
      ]);
    };

    // Confirm joining
    const handleJoinSuccess = () => {
      setJoined(true);
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_notification", handleNotification);
    socket.on("join_success", handleJoinSuccess);

    // Connect
    socket.connect();

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_notification", handleNotification);
      socket.off("join_success", handleJoinSuccess);

      socket.disconnect();
    };
  }, []);

  // Join chat
  const joinChat = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter your username");
      return;
    }

    if (!socket.connected) {
      alert("Server is not connected!");
      return;
    }

    socket.emit("join_chat", username.trim());
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !joined) {
      return;
    }

    if (!socket.connected) {
      alert("Server is not connected!");
      return;
    }

    socket.emit("send_message", {
      text: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="chat-container">
      <h1>Real-Time Chat Application</h1>

      {/* Connection Status */}

      <div className="connection-status">
        Status:
        <span className={status === "Connected" ? "online" : "offline"}>
          {status}
        </span>
      </div>

      {/* Username Section */}

      <form className="username-section" onSubmit={joinChat}>
        <label>Enter Username</label>

        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength="20"
          disabled={joined}
        />

        <button type="submit" disabled={joined || status !== "Connected"}>
          {joined ? "Joined" : "Join Chat"}
        </button>
      </form>

      {/* Online Users */}

      <div className="online-users">
        <h3>Online Users ({onlineUsers.length})</h3>

        {onlineUsers.length === 0 ? (
          <p>No users online</p>
        ) : (
          onlineUsers.map((user, index) => (
            <span className="user-item" key={index}>
              🟢 {user}
            </span>
          ))
        )}
      </div>

      {/* Chat Messages */}

      <div className="chat-box">
        {messages.length === 0 ? (
          <p className="empty-message">
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              className={msg.system ? "system-message" : "message"}
              key={msg.id}
            >
              {msg.system ? (
                <p>{msg.text}</p>
              ) : (
                <>
                  <strong>{msg.username}</strong>

                  <p>{msg.text}</p>

                  <small>{msg.time}</small>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder={joined ? "Type your message..." : "Join the chat first"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength="500"
          disabled={!joined}
        />

        <button type="submit" disabled={!joined || status !== "Connected"}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
