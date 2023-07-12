const mongoose = require("mongoose");
const Message = require("./message");

const callHistorySchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chats",
  },
  calls: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "calls",
      },
    ],
    default: [],
  },
});
const callSchema = new mongoose.Schema(
  {
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    duration: { type: Number, default: -1 },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  CallHistory: mongoose.model("callHistory", callHistorySchema),
  Call: mongoose.model("calls", callSchema),
};
