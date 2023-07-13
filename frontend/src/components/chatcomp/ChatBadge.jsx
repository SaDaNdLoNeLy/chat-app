import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../StateProvider";
import MessageBubble from "./MessageBubble";

const ChatBadge = ({ messages, handleJoinCall }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed className="no-scrollbar">
      {messages &&
        messages.map((m, index) => {
          console.log("message: ", m);
          return (
            <div
              className={`chat my-2 ${
                m.sender._id === user.id ? "chat-end" : "chat-start"
              }`}
              key={m._id}
            >
              <div className="placeholder chat-image avatar">
                <div
                  className={`w-10 rounded-full ${
                    m.sender._id === user.id ? "bg-btn" : "bg-primary"
                  }`}
                >
                  {m.sender.username[0]}
                </div>
              </div>
              <div className="chat-header">
                {m.sender._id === user.id ? "You" : m.sender.username}
              </div>
              <MessageBubble m={m} handleJoinCall={handleJoinCall} />
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ChatBadge;
