const User = require("../models/user");
const { Socket } = require("socket.io");
const { USER_STATUS } = require("../constants");
const Chat = require("../models/chat");
const {
  getAllChatIdContainUser,
} = require("../controllers/chat/chatController");
const { updateUserCalling } = require("../controllers/user/userController");
const { Call, CallHistory } = require("../models/callHistory");

const changeStatusUser = async ({ io = null, socket = null, status }) => {
  const changedUser = await User.findById(socket.user.userId);
  changedUser.status = status;
  await changedUser.save();
};

const getOnlineUsersNumInRoom = async ({ io = null, socket = null, room }) => {
  const sockets = await io.in(room).fetchSockets();
  const users = sockets.map((socket) => socket.user);
  return users.length;
};

const updateUserStatusInChats = async ({
  io = null,
  socket = null,
  status,
}) => {
  const userChatIds = await getAllChatIdContainUser(socket.user.userId);

  userChatIds.forEach((chatId) => {
    socket
      .to(chatId)
      .emit("user change status", socket.user.userId, chatId, status);
  });
};

const joinChats = async ({ io = null, socket = null }) => {
  const chatIds = await getAllChatIdContainUser(socket.user.userId);
  chatIds.forEach((chatId) => {
    socket.join(chatId);
  });
};

const addCallingUser = async ({ io = null, socket = null, userId }) => {};

const leaveCallGroup = async ({ io = null, socket = null }) => {
  const chatId = socket.chatId;
  const chatObj = await Chat.findById(chatId);
  const participants = chatObj.currentCall.participants;
  // console.log("participants :", participants);
  // console.log("socket.user.userId :", socket.user.userId);
  const index = participants.findIndex(
    (user_id) => user_id.valueOf() === socket.user.userId
  );
  // console.log("index :", index);
  if (index === -1) return;
  participants.splice(index, 1);
  ///update user is calling
  updateUserCalling(socket.user.userId, false);

  if (participants.length === 0) {
    chatObj.currentCall.isCalling = false;
    const callHistoryObj = await CallHistory.findOne({ chat: chatId });
    const lastCall = callHistoryObj.calls[callHistoryObj.calls.length - 1];
    const callObj = await Call.findById(lastCall);
    callObj.duration = Date.now() - callObj.createdAt;
    await callObj.save();
  }
  await chatObj.save();

  socket
    .in(chatId)
    .emit("leaved call", socket.user, chatId, chatObj.currentCall.isCalling);
};

const joinCallGroup = async ({ io = null, socket = null }) => {
  chatObj.currentCall.isCalling = true;
  chatObj.currentCall.participants.push(socket.user.userId);
  await chatObj.save();

  ///sent invite call
  chat.users.forEach((user) => {
    if (user._id === newMessage.sender._id) return;
    socket
      .in(user._id)
      .emit("invite call", newMessage.sender.username, chat._id, joinLink);
  });
};

module.exports = {
  changeStatusUser,
  getOnlineUsersNumInRoom,
  updateUserStatusInChats,
  joinChats,
  leaveCallGroup,
  joinCallGroup,
};
