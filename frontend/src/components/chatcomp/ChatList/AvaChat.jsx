import React from "react";
import { getSender } from "../../../utils/chat";
function AvaChat({
  setSelectedChat,
  hoverImgIdx,
  selectedChat,
  chat,
  setHoverImgIdx,
  loggedUser,
}) {
  return (
    <div className="float-left before:table before:content-[''] after:clear-both after:table after:content-['']">
      <div
        onClick={() => {
          console.log("selected chat: ", chat);
          setSelectedChat(chat);
          // handleClickImg(chat._id);
        }}
        className={`flex cursor-pointer select-none items-center justify-center ${
          !chat.avatar && (hoverImgIdx === chat._id || selectedChat === chat)
            ? "  bg-btn"
            : "  bg-zinc-600"
        }
        `}
        style={{
          width: "3rem",
          height: "3rem",
          WebkitTransition: "background 0.5s, border-radius 0.5s",
          transition: "background 0.5s, border-radius 0.5s",
          borderRadius: `${
            hoverImgIdx === chat._id || selectedChat === chat
              ? "0.75rem"
              : "50%"
          }`,
        }}
        onMouseLeave={() => {
          setHoverImgIdx(null);
        }}
        onMouseEnter={() => {
          setHoverImgIdx(chat._id);
        }}
      >
        {chat.avatar ? (
          <img
            className={`h-full w-full  object-cover `}
            style={{
              borderRadius: "inherit",
            }}
            src={chat.avatar}
          />
        ) : (
          <span className="m-2 select-none text-xl font-bold text-white">
            {!chat.isGroup
              ? getSender(loggedUser, chat.users).slice(0, 1).toUpperCase()
              : chat.chatName.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

export default AvaChat;
