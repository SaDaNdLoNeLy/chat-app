const Message = require("../../models/message");
const User = require("../../models/user");
const Chat = require("../../models/chat");
const { Call, CallHistory } = require("../../models/callHistory");
const sendMessage = async (req, res) => {
  const { chatId, content, chatType } = req.body;

  if (!chatId || (!content && chatType === "text")) {
    res.status(400).send("Invalid data for request");
  }
  if (chatType === "video" || chatType === "audio") {
  }

  const newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
    chatType: chatType,
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
    // console.log("message", message);
    res.json(message);
  } catch (err) {
    res.status(400).send("Something went wrong please try again.");
  }
};

const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username email")
      .populate("chat")
      .lean()
      .exec();

    const callHistory = await CallHistory.findOne(
      {
        chat: req.params.chatId,
      },
      "-chat"
    )
      .populate("calls")
      .lean()
      .exec();

    const joinedMessages = messages.map((message) => {
      if (message.chatType === "audio" || message.chatType === "video") {
        const call = callHistory.calls.find((call) => {
          return call.message.valueOf() === message._id.valueOf();
        });
        if (call) {
          message.callInfo = call;
        }
      }
      // console.log("message: ", message);
      return message;
    });

    res.json(joinedMessages);
  } catch (error) {
    // console.log(error.message);
    throw error;
    res.status(400).send("Something went wrong.");
  }
};

module.exports = { sendMessage, getAllMessage };
