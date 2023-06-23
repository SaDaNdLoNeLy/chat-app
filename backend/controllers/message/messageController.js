const Message = require("../../models/message");
const User = require("../../models/user");
const Chat = require("../../models/chat");

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    res.status(400).send("Invalid data for request");
  }
  const newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "username email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    res.status(400).send("Something went wron please try again.");
  }
};

const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "username email"
    ).populate("chat");

    res.json(messages)
  } catch (error) {
    res.status(400).send("Something went wrong.")
  }
};

module.exports = { sendMessage, getAllMessage };
