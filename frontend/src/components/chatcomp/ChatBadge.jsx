import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../StateProvider";

const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const ChatBadge = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed className="no-scrollbar">
      {messages &&
        messages.map((m) => (
          <div
            className={`chat my-2 ${
              m.sender._id === user.id ? "chat-end" : "chat-start"
            }`}
            key={m._id}
          >
            <div className="placeholder chat-image avatar">
              <div className="w-10 rounded-full bg-primary">
                {m.sender.username[0]}
              </div>
            </div>
            <div className="chat-header">{m.sender.username}</div>
            <div className="chat-bubble text-white">{m.content}</div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ChatBadge;
