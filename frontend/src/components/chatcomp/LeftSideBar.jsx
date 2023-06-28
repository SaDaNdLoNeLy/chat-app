import React from "react";
import { Stack, Divider, Tooltip, Badge } from "@mui/material";

const myTransition = "transition duration-500 ease-in-out";
function LeftSideBar({
  listChat,
  hoverImgIdx,
  selectedChat,
  myTransition,
  loggedUser,
  setSelectedChat,
  setHoverImgIdx,
  getSender,
}) {
  const sortedListChat = listChat?.sort((a, b) => {
    if (a.isGroup && !b.isGroup) return -1;
    if (!a.isGroup && b.isGroup) return 1;
    else {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });
  return (
    <Stack
      className="no-scrollbar relative h-full w-20 flex-shrink-0 overflow-y-scroll pr-3 pt-5"
      style={{
        backgroundColor: "#1e1f22",
      }}
    >
      {sortedListChat.map((chat, idx) => {
        return (
          <>
            <div
              className="
        relative my-3 ml-1 flex w-full flex-row justify-center
      "
              key={chat._id}
            >
              <div className="absolute left-0 top-0 flex h-12 w-2 items-center justify-start">
                <span
                  className={`absolute -ml-1 block w-1 bg-white ${
                    hoverImgIdx === chat._id && selectedChat !== chat
                      ? "h-5"
                      : selectedChat === chat
                      ? "h-8"
                      : "h-2"
                  } ${myTransition}
            `}
                  style={{
                    borderRadius: "0 4px 4px 0",
                  }}
                ></span>
              </div>

              {/* <ToolTip  */}
              <Tooltip
                title={
                  !chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName
                }
                placement="right-start"
              >
                <Badge
                  badgeContent={chat.not_num}
                  color="primary"
                  anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      border: `4px solid #1e1f22`,
                      padding: "8px 4px",
                      fontSize: "0.9rem",
                      right: `${
                        chat.not_num < 9
                          ? "4px"
                          : chat.not_num < 99
                          ? "8px"
                          : "12px"
                      }`,
                    },
                  }}
                >
                  {chat.avatar ? (
                    <div className="float-left before:table before:content-[''] after:clear-both after:table after:content-['']">
                      <div
                        onClick={() => {
                          setSelectedChat(chat);
                          // handleClickImg(chat._id);
                        }}
                        className={`flex cursor-pointer select-none items-center justify-center`}
                        style={{
                          width: "3rem",
                          height: "3rem",
                          webkitTransition:
                            "background 0.5s, border-radius 0.5s",
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
                        <img
                          className={`h-full w-full  object-cover `}
                          style={{
                            borderRadius: "inherit",
                          }}
                          src={chat.avatar}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="float-left before:table before:content-[''] after:clear-both after:table after:content-['']">
                      <div
                        onClick={() => {
                          setSelectedChat(chat);
                        }}
                        className={`flex cursor-pointer select-none items-center justify-center ${
                          hoverImgIdx === chat._id || selectedChat === chat
                            ? "  bg-btn"
                            : "  bg-zinc-600"
                        }`}
                        style={{
                          width: "3rem",
                          height: "3rem",
                          WebkitTransition:
                            "background 0.5s, border-radius 0.5s",
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
                        <span className="m-2 select-none text-xl font-bold text-white">
                          {!chat.isGroup
                            ? getSender(loggedUser, chat.users)
                                .slice(0, 1)
                                .toUpperCase()
                            : chat.chatName.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </Badge>
              </Tooltip>
            </div>
            {idx <= sortedListChat.length - 2 &&
              chat.isGroup !== sortedListChat[idx + 1]?.isGroup && (
                <Divider className=" bg-white" />
              )}
          </>
        );
      })}
    </Stack>
  );
}

export default LeftSideBar;
