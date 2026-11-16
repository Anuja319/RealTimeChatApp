import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Disconnected");

  const [username, setUsername] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Handle connection
    const handleConnect = () => {
      console.log("Connected:", socket.id);
      setStatus("Connected");
    };

    // Handle disconnection
    const handleDisconnect = () => {
      console.log("Disconnected");
      setStatus("Disconnected");
    };

    // Handle connection error
    const handleError = (error) => {
      console.log("Connection error:", error.message);
      setStatus("Connection Failed");
    };

    // Receive messages
    const handleReceiveMessage = (data) => {
      setMessages((previousMessages) => [...previousMessages, data]);
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("receive_message", handleReceiveMessage);

    // Connect to server
    socket.connect();

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("receive_message", handleReceiveMessage);

      socket.disconnect();
    };
  }, []);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();

    if (!username.trim() || !message.trim()) {
      return;
    }

    if (!socket.connected) {
      alert("Server is not connected!");
      return;
    }

    socket.emit("send_message", {
      username: username.trim(),
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

      {/* Username */}

      <div className="username-section">
        <label>Enter Username</label>

        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength="20"
        />
      </div>

      {/* Chat Messages */}

      <div className="chat-box">
        {messages.length === 0 ? (
          <p className="empty-message">
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div className="message" key={msg.id}>
              <strong>{msg.username}</strong>

              <p>{msg.text}</p>

              <small>{msg.time}</small>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength="500"
        />

        <button type="submit" disabled={status !== "Connected"}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
