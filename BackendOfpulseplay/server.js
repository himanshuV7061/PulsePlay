const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const liveEvents = [
  {
    text: "🔥 FOUR by Kohli",
    score: 156,
    wickets: 3,
    momentum: 70,
  },
  {
    text: "🚀 SIX by SKY",
    score: 162,
    wickets: 3,
    momentum: 85,
  },
  {
    text: "😱 WICKET! Rohit OUT",
    score: 162,
    wickets: 4,
    momentum: 55,
  },
  {
    text: "👏 Crowd going wild",
    score: 170,
    wickets: 4,
    momentum: 92,
  },
];

io.on("connection", (socket) => {
  console.log("User connected");

  // LIVE EVENTS
  let index = 0;

  const interval = setInterval(() => {
    if (index >= liveEvents.length) {
      index = 0;
    }

    socket.emit(
      "match-update",
      liveEvents[index]
    );

    index++;
  }, 4000);

  // CHAT SYSTEM
  socket.on("send-message", (message) => {
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    clearInterval(interval);
  });
});

server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});