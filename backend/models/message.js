const mongoose = require("mongoose");
const User = require("./user");
const Chat = require("./chat");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
    chatType: {
      type: String,
      enum: ["text", "video", "audio", "file", "image"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);
