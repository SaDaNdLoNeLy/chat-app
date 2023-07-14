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
const callhistoryRouter = require("./routes/callhistory.route");
// const { addParticipant } = require("./services/call.service");
const { promisify } = require("util");
// const { getCallByChatId, createCall } = require("./services/call.service");
const Chat = require("./models/chat");
const User = require("./models/user");
const Message = require("./models/message");
const { USER_STATUS } = require("./constants");
const app = express();
const fs = require("fs");
const {
  changeStatusUser,
  updateUserStatusInChats,
  getOnlineUsersNumInRoom,
  joinChats,
  leaveCallGroup,
} = require("./controllers/socket");

const {
  updateUserCalling,
  checkUserInCall,
} = require("./controllers/user/userController");

const { Call, CallHistory } = require("./models/callHistory");
const { join } = require("path");

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

app.use("/api/callhistories", callhistoryRouter);

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
  const { token, page, chatId, messageId, joinLink, isGroup } =
    socket.handshake.query;
  promisify(jwt.verify)
    .bind(jwt)(token, process.env.TOKEN_KEY)
    .then((decoded) => {
      socket.user = { ...decoded };
      socket.page = page;
      if (socket.page === "call") {
        socket.chatId = chatId;
        socket.messageId = messageId;
        socket.joinLink = joinLink;
        socket.isGroup = isGroup === "true";
      }
      next();
    })
    .catch((err) => {
      console.log("err :", err.message);
      next(new Error("Internal server error"));
    });
});

io.on("connection", async (socket) => {
  console.log("connected to socket :", socket.user, "\npage: ", socket.page);
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

  socket.on("typing", (room) => io.in(room).emit("typing"));
  socket.on("stop typing", (room) => io.in(room).emit("stop typing"));

  socket.on("send message", async (newMessage) => {
    // console.log("newMess :", newMessage);
    if (!newMessage) return;
    let chat = newMessage.chat;
    if (!chat.users) {
      console.log("chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      io.in(user._id).emit("message received", newMessage);
    });
  });

  socket.on("join call", async () => {
    const chatId = socket.chatId;
    const messageId = socket.messageId;
    const joinLink = socket.joinLink;
    const isGroup = socket.isGroup;

    const chatObj = await Chat.findById(chatId);
    const prevCalling = chatObj.currentCall.isCalling;
    // console.log("chatObj.currentCall :", chatObj.currentCall);

    if (!chatObj) {
      socket.emit("join call error", "Chat not found");
      return;
    }
    if (
      chatObj.currentCall.participants.find(
        (user_id) => user_id.valueOf() === socket.user.userId
      )
    )
      return;

    if (!prevCalling) {
      const callObj = await Call.create({
        message: messageId,
      });
      let callHistoryObj = await CallHistory.findOne({
        chat: chatId,
      });
      if (!callHistoryObj)
        callHistoryObj = await CallHistory.create({
          chat: chatId,
        });
      callHistoryObj.calls.push(callObj._id);
      await callHistoryObj.save();

      chatObj.currentCall.isCalling = true;
      chatObj.currentCall.joinLink = joinLink;
    }

    ///update user is calling
    updateUserCalling(socket.user.userId, true);

    ///update chatobj participants
    chatObj.currentCall.participants.push(socket.user.userId);
    await chatObj.save();

    if (!prevCalling && chatObj.isGroup) {
      chatObj.users.forEach(async (user) => {
        const userId = user._id.valueOf();
        if (userId === socket.user.userId) return;
        if (await checkUserInCall(userId)) return;
        io.in(userId).emit(
          "invite call",
          socket.user,
          chatId,
          joinLink,
          isGroup
        );
      });

      io.in(chatId).emit("change current call", chatId, true, joinLink);
    }
  });

  socket.on("send call p2p", async (chatId, joinLink, messageId) => {
    const chatObj = await Chat.findById(chatId);
    const prevCalling = chatObj.currentCall.isCalling;
    // console.log("chatObj.currentCall :", chatObj.currentCall);

    if (!chatObj) {
      socket.emit("join call error", "Chat not found");
      return;
    }
    if (
      chatObj.currentCall.participants.find(
        (user_id) => user_id === socket.user.userId
      )
    )
      return;

    if (!prevCalling) {
      const callObj = await Call.create({
        message: messageId,
      });
      let callHistoryObj = await CallHistory.findOne({
        chat: chatId,
      });
      if (!callHistoryObj)
        callHistoryObj = await CallHistory.create({
          chat: chatId,
        });
      callHistoryObj.calls.push(callObj._id);
      await callHistoryObj.save();

      chatObj.currentCall.isCalling = true;
      chatObj.currentCall.joinLink = joinLink;
    }

    ///update user is calling
    // updateUserCalling(socket.user.userId, true);

    ///update chatobj participants
    // chatObj.currentCall.participants.push(socket.user.userId);
    await chatObj.save();

    // const sockets = await io.in(chatId).fetchSockets();
    // const users = sockets.map((socket) => socket.user);
    // console.log("num: ", users);

    io.in(chatId).emit("change current call", chatId, true, joinLink);
    socket
      .to(chatId)
      .emit("invite call", socket.user, chatId, joinLink, false, messageId);
  });

  socket.on("send cancel call", async (chatId, messageId) => {
    console.log("send cancel call: ", chatId, messageId);
    const chatObj = await Chat.findById(chatId);

    // console.log("participants :", participants);
    // console.log("socket.user.userId :", socket.user.userId);
    ///update user is calling
    // updateUserCalling(chatObj.currentCall.participants[0], false);
    // chatObj.currentCall.participants = [];

    chatObj.currentCall.isCalling = false;
    chatObj.currentCall.joinLink = "";

    const callHistoryObj = await CallHistory.findOne({ chat: chatId });
    const lastCall = callHistoryObj.calls[callHistoryObj.calls.length - 1];
    const callObj = await Call.findById(lastCall);
    callObj.isCanceled = true;

    await callObj.save();
    await chatObj.save();

    // const sockets = await io.in(chatId).fetchSockets();
    // const users = sockets.map((socket) => socket.user);
    // console.log("num: ", users);
    // console.log("send cancel call: ", chatId, messageId, socket.user.username);
    io.in(chatId).emit("change current call", chatId, false, "");
    socket.to(chatId).emit("cancel call", socket.user.username);
  });

  socket.on("send accept call p2p", (chatId, joinLink) => {
    socket.to(chatId).emit("accept call p2p", joinLink);
  });

  socket.on("disconnect", async () => {
    console.log(`${socket.user.username}:${socket.page} disconnected`);
    const sessionChatNum = await getOnlineUsersNumInRoom({
      io,
      room: socket.user.userId,
    });
    const sessionCallNum = await getOnlineUsersNumInRoom({
      io,
      room: socket.user.userId + ":call",
    });

    if (sessionCallNum === 0 && socket.page === "call") {
      await leaveCallGroup({ io, socket });
    }
    if (sessionChatNum === 0 && sessionCallNum === 0) {
      changeStatusUser({ socket, status: USER_STATUS.OFFLINE });
      updateUserStatusInChats({ io, socket, status: USER_STATUS.OFFLINE });
    }
  });
});
