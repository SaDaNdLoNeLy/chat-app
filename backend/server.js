const express = require("express");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || process.env.API_PORT;

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const agoraRouter = require("./routes/agora");
// const { addParticipant } = require("./services/call.service");
const { promisify } = require("util");
// const { getCallByChatId, createCall } = require("./services/call.service");
const Chat = require("./models/chat");
const User = require("./models/user");
const { USER_STATUS } = require("./constants");
const app = express();
const fs = require("fs");
const {
  changeStatusUser,
  updateUserStatusInChats,
  getOnlineUsersNumInRoom,
  joinChats,
} = require("./controllers/socket");

const { Call, CallHistory } = require("./models/callHistory");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};
// Route for authentication
app.use("/api/auth", authRouter);
// Route for user experience
app.use("/api/user", userRouter);
// Route for chat
app.use("/api/chat", chatRouter);
// Route for messages
app.use("/api/message", messageRouter);

app.use("/api/agora", agoraRouter);

const server = https.createServer(options, app);

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is listen on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("DB failed");
    // console.error(err.message);
  });

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.use((socket, next) => {
  const { token, page } = socket.handshake.query;
  promisify(jwt.verify)
    .bind(jwt)(token, process.env.TOKEN_KEY)
    .then((decoded) => {
      socket.user = { ...decoded };
      socket.page = page;
      next();
    })
    .catch((err) => {
      if (err.message === "jwt expired") {
        next(new Error("Token expired"));
      } else next(new Error("Internal server error"));
    });
});

io.on("connection", async (socket) => {
  console.log("connected to socket :", socket.user);
  // socket.on("setup", (userData) => {
  // console.log("socket.user: ", socket.user, "socket.id: ", socket.id);

  await joinChats({ socket });

  const sessionChatNum = await getOnlineUsersNumInRoom({
    io,
    room: socket.user.userId,
  });

  const sessionCallNum = await getOnlineUsersNumInRoom({
    io,
    room: socket.user.userId + ":call",
  });

  if (sessionChatNum === 0 && sessionCallNum === 0) {
    await changeStatusUser({ socket, status: USER_STATUS.ONLINE });
    await updateUserStatusInChats({ io, socket, status: USER_STATUS.ONLINE });
  }

  socket.emit("change online status");

  if (socket.page === "call") {
    socket.join(socket.user.userId + ":call");
  } else {
    socket.join(socket.user.userId);
  }

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("send message", async (newMessage, joinLink = null) => {
    console.log("newMess :", newMessage);
    if (!newMessage) return;
    let chat = newMessage.chat;
    if (!chat.users) console.log("chat.users not defined");

    if (newMessage.chatType === "video" || newMessage.chatType === "audio") {
      ///create call, add to call history, add participants
      const callObj = await Call.create({
        message: newMessage._id,
      });
      let callHistoryObj = await CallHistory.findOne({
        chat: chat._id,
      });
      if (!callHistoryObj)
        callHistoryObj = await CallHistory.create({
          chat: chat._id,
        });
      callHistoryObj.calls.push(callObj._id);
      await callHistoryObj.save();

      const chatObj = await Chat.findById(chat._id);

      chatObj.currentCall.isCalling = true;
      chatObj.currentCall.participants = [newMessage.sender._id];
      await chatObj.save();

      ///sent invite call
      chat.users.forEach((user) => {
        if (user._id === newMessage.sender._id) return;
        socket
          .in(user._id)
          .emit("invite call", newMessage.sender.username, chat._id, joinLink);
      });
    }

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  socket.on("join call", async (chatId) => {
    const chatObj = await Chat.findById(chatId);
    // console.log("chatObj :", chatObj);
    if (
      chatObj.currentCall.participants.find(
        (user_id) => user_id === socket.user.userId
      )
    )
      return;
    chatObj.currentCall.participants.push(socket.user.userId);
    await chatObj.save();
  });

  socket.on("leave call", async (chatId) => {
    const chatObj = await Chat.findById(chatId);
    const participants = chatObj.currentCall.participants;
    console.log("participants :", participants);
    console.log("socket.user.userId :", socket.user.userId);
    const index = participants.findIndex(
      (user_id) => user_id.valueOf() === socket.user.userId
    );
    console.log("index :", index);
    if (index === -1) return;
    participants.splice(index, 1);
    if (participants.length === 0) {
      chatObj.currentCall.isCalling = false;
    }
    await chatObj.save();
    const callHistoryObj = await CallHistory.findOne({ chat: chatId });
    const lastCall = callHistoryObj.calls[callHistoryObj.calls.length - 1];
    const callObj = await Call.findById(lastCall);
    callObj.duration = Date.now() - callObj.createdAt;
    await callObj.save();
    socket.in(chatId).emit("leaved call", socket.user.userId, chatId);
    // socket.emit("leaved call yourself", chatId);
  });

  socket.on("disconnect", async () => {
    console.log("disconnected");
    const sessionChatNum = await getOnlineUsersNumInRoom({
      io,
      room: socket.user.userId,
    });
    const sessionCallNum = await getOnlineUsersNumInRoom({
      io,
      room: socket.user.userId + ":call",
    });

    if (sessionChatNum === 0 && sessionCallNum === 0) {
      changeStatusUser({ socket, status: USER_STATUS.OFFLINE });
      updateUserStatusInChats({ io, socket, status: USER_STATUS.OFFLINE });
    }
  });
});
