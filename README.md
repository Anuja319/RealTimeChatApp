# 💬 Real-Time Chat Application

A real-time chat application built using React.js and Node.js with Socket.IO. It allows multiple users to communicate instantly through a WebSocket connection without refreshing the browser.

## 🚀 Features

- Real-time messaging between multiple users.
- WebSocket communication using Socket.IO.
- Online users count and username display.
- Instant join and leave notifications.
- Connection and disconnection handling.
- Different message styles for sent and received messages.
- Automatic scrolling to the latest message.
- Responsive user interface.

## 🛠️ Technologies Used

**Frontend:**

- React.js
- JavaScript
- CSS3
- Vite
- Socket.IO Client

**Backend:**

- Node.js
- Express.js
- Socket.IO
- HTTP

## 📁 Project Structure

```text
RealTimeChatApp/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── socket.js
│   │
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- Code editor (VS Code recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Anuja319/RealTimeChatApp.git
```

### 2. Navigate to the Project

```bash
cd RealTimeChatApp
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

http://localhost:5000

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

http://localhost:5173

## 🧪 How to Test Real-Time Communication

1. Start both backend and frontend servers.
2. Open http://localhost:5173 in your browser.
3. Open the same application in a second browser window.
4. Enter different usernames in both windows.
5. Join the chat.
6. Send messages from either window.
7. Observe messages appearing instantly in both windows.
8. Close one browser window and observe the online users count updating.

## 🔌 WebSocket Communication

Socket.IO establishes a persistent, bidirectional connection between the client and server.

The application uses the following events:

| Event             | Description                           |
| ----------------- | ------------------------------------- |
| connection        | Handles a new client connection       |
| join_chat         | Registers a username                  |
| join_success      | Confirms successful joining           |
| send_message      | Sends a chat message                  |
| receive_message   | Receives a broadcast message          |
| online_users      | Updates the online users list         |
| user_notification | Displays join and leave notifications |
| disconnect        | Handles client disconnection          |

## 🎯 Learning Outcomes

- Understanding WebSocket communication.
- Implementing Socket.IO in React and Node.js.
- Managing multiple connected clients.
- Broadcasting real-time messages.
- Handling connection and disconnection events.
- Building interactive real-time applications.

## 👩‍💻 Author

**Anuja Kokitkar**

GitHub: https://github.com/Anuja319
