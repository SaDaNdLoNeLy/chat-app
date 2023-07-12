const mongoose = require("mongoose");
const User = require("./user");
const Message = require("./message");

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroup: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    currentCall: {
      isCalling: { type: Boolean, default: false },
      participants: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
        ],
        default: [],
      },
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatSchema);
