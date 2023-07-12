import React from "react";
import { Stack, Divider, Tooltip, Badge } from "@mui/material";
import AvaChat from "./AvaChat";
import { getSender, getSenderStatus } from "../../../utils/chat";

function LeftSideBar({
  listChat,
  hoverImgIdx,
  selectedChat,
  myTransition,
  loggedUser,
  setSelectedChat,
  setHoverImgIdx,
}) {
  const sortedListChat = listChat?.sort((a, b) => {
    if (a.isGroup && !b.isGroup) return -1;
    if (!a.isGroup && b.isGroup) return 1;
    else {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });
  // console.log("sortedListChat: ", sortedListChat);
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
                    : chat.chatName + "(Group)"
                }
                placement="right-start"
              >
                <Badge
                  badgeContent={1}
                  color="primary"
                  anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
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
                  <div className="relative">
                    <AvaChat
                      chat={chat}
                      setSelectedChat={setSelectedChat}
                      hoverImgIdx={hoverImgIdx}
                      selectedChat={selectedChat}
                      setHoverImgIdx={setHoverImgIdx}
                      loggedUser={loggedUser}
                    />
                    {!chat.isGroup ? (
                      getSenderStatus(loggedUser, chat.users) ===
                      "online" ? (
                        <div
                          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 "
                          style={{
                            border: " 3px solid #1e1f22",
                          }}
                        />
                      ) : (
                        <div
                          className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gray-500 "
                          style={{
                            border: " 3px solid #1e1f22",
                          }}
                        />
                      )
                    ) : (
                      <></>
                    )}
                  </div>
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
