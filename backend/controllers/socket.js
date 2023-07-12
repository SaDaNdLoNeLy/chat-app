const User = require("../models/user");
const { Socket } = require("socket.io");
const { USER_STATUS } = require("../constants");
const Chat = require("../models/chat");
const {
  getAllChatIdContainUser,
} = require("../controllers/chat/chatController");

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

module.exports = {
  changeStatusUser,
  getOnlineUsersNumInRoom,
  updateUserStatusInChats,
  joinChats,
};
