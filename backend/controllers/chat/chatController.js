const Chat = require("../../models/chat");
const User = require("../../models/user");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).send("No user ID is provided");
  }

  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chat = {
      chatName: "sender",
      isGroup: false,
      users: [req.user.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chat);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).send(fullChat);
    } catch (err) {
      res.status(400).send("Something went wrong. Please try again");
    }
  }
};

const getAllChatIdContainUser = async (userId) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: userId } },
  });
  //   console.log(chats);
  return chats.map((chat) => chat._id.valueOf());
};

const getChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Chat.populate(results, {
          path: "latestMessage.sender",
          select: "username email",
        });

        res.status(200).send(results);
      });
  } catch (err) {
    res.status(400).send("Something went wrong. Please try again");
  }
};

const createGroup = async (req, res) => {
  // console.log(req.body);
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to create a group chat");
  }

  users.push(req.user.userId);
  // console.log(users);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroup: true,
      groupAdmin: req.user.userId,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const modifiedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!modifiedGroup) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(modifiedGroup);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const modifiedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!modifiedGroup) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(modifiedGroup);
  }
};

module.exports = {
  accessChat,
  getChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  getAllChatIdContainUser,
};
