const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || process.env.API_PORT;

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Route for authentication
app.use("/api/auth", authRouter);
// Route for user experience
app.use("/api/user", userRouter);
// Route for chat
app.use("/api/chat", chatRouter);
// Route for messages
app.use("/api/message", messageRouter);
const server = http.createServer(app);

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is listen on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("DB failed");
    console.error(err);
  });

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    console.log(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("typing", ({room,user}) => {
    socket.broadcast.to(room).emit("typing",{sender : user});
  });
  
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("send message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
