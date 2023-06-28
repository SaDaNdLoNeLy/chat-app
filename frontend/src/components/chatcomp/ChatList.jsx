import React, { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import {
  Snackbar,
  Alert,
  Stack,
  Tooltip,
  Badge,
  OutlinedInput,
  Divider,
} from "@mui/material";

// import ToolTip from "../ToolTip";
import { getAllChat } from "../../api";
import ChatLoading from "./ChatLoading";
import GroupChatPopup from "./GroupChatPopup";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";

const myTransition = "transition-all duration-300 ease-in-out";

const ChatList = ({ fetch }) => {
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [isOpenMic, setIsOpenMic] = useState(false);

  const [loggedUser, setLoggedUser] = useState();
  const {
    user: currUser,
    selectedChat,
    setSelectedChat,
    listChat,
    setListChat,
  } = ChatState();
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [hoverImgIdx, setHoverImgIdx] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(null);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id
      ? users[0].username
      : users[1].username;
  };

  // const handleClickImg = (value) => {
  //   setActiveImgIdx(value);
  // };
  console.log("listChat", listChat);
  const fetchChat = async () => {
    try {
      const response = await getAllChat(currUser._id);
      console.log(response.data);
      setListChat(response.data);
    } catch (err) {
      setOpen(true);
      setErrorContent("Failed to load chats");
    }
  };
  const [hoverChatCard, setHoverCharCard] = useState(null);
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChat();
  }, [fetch]);
  const selectedChatOtherUsers = selectedChat?.users.filter(
    (u) => u._id !== currUser.id
  );
  const sortedListChat = listChat?.sort((a, b) => {
    if (a.isGroup && !b.isGroup) return -1;
    if (!a.isGroup && b.isGroup) return 1;
    else {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });
  console.log("sortedListChat", sortedListChat);
  // console.log("selectedChatOtherUsers", selectedChatOtherUsers);
  return (
    <div className="container flex w-[500px] flex-col items-center rounded-lg bg-secondary p-2">
      <div className="flex w-full items-center justify-between px-2 pb-2 text-3xl text-white">
        MyChats
        <GroupChatPopup />
      </div>
      <div className="flex h-full w-full flex-row overflow-y-hidden rounded-lg bg-primary">
        {sortedListChat ? (
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
                          <div
                            onClick={() => {
                              setSelectedChat(chat);
                              // handleClickImg(chat._id);
                            }}
                            className={`h-12 w-12 cursor-pointer select-none hover:rounded-lg ${
                              selectedChat === chat
                                ? "rounded-lg"
                                : "rounded-full"
                            } `}
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
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedChat(chat);
                              // handleClickImg(chat._id);
                            }}
                            className={`flex h-12 w-12 cursor-pointer select-none items-center justify-center ${
                              hoverImgIdx === chat._id || selectedChat === chat
                                ? "rounded-lg bg-btn"
                                : "rounded-full bg-zinc-600"
                            }`}
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
        ) : (
          <ChatLoading />
        )}
        <Stack className="no-scrollbar relative h-full w-full overflow-y-scroll bg-zinc-800 pt-2">
          <div className="flex h-full flex-col">
            <div
              className="sticky -top-2 z-10 box-border flex w-full flex-col bg-zinc-800 py-2 
              shadow-slate-50"
            >
              {/* <OutlinedInput
                placeholder="Find your friends"
                className=" w-11/12"
                sx={{
                  color: "white",
                  backgroundColor: "#1e1f22",
                  alignSelf: "center",
                }}
              /> */}
              <label
                htmlFor="my-drawer"
                className="btn-primary drawer-button btn h-10 w-40 self-center border-none bg-btn"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span className="hidden md:block">Search User</span>
              </label>
            </div>

            <div className="ml-2 mt-2 cursor-pointer font-medium hover:text-zinc-300">
              {selectedChat?.isGroup && "Online Users".toUpperCase()}
            </div>
            <div className="ml-2 mt-2 flex flex-1 flex-col">
              {selectedChat?.isGroup &&
                selectedChatOtherUsers?.length !== 0 &&
                selectedChatOtherUsers?.map((user) => (
                  <div
                    className="mb-2 flex cursor-pointer flex-row items-center rounded-xl p-2 hover:bg-zinc-600"
                    key={user._id}
                    onMouseEnter={() => {
                      setHoverCharCard(user._id);
                    }}
                    onMouseLeave={() => {
                      setHoverCharCard(null);
                    }}
                  >
                    <div className="relative mr-4 flex-shrink-0">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                        />
                      ) : (
                        <div
                          className={
                            "flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full bg-zinc-600"
                          }
                        >
                          <span className="m-2 select-none text-xl font-bold text-white">
                            {user.username.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {user.status === 1 ? (
                        <div
                          className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-green-500 "
                          style={{
                            border: " 3px solid #1e1f22",
                          }}
                        />
                      ) : (
                        <div
                          className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-gray-500 "
                          style={{
                            border: " 3px solid #1e1f22",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-row items-center justify-between">
                      <div className="flex flex-col items-start justify-center ">
                        <div className="font-semibold text-white">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="sticky -bottom-1 bg-secondary px-2 py-3">
              <div className="flex flex-row items-center justify-between">
                <div className="mr-4 flex flex-grow cursor-pointer flex-row items-center rounded-md p-2 hover:bg-zinc-600">
                  <div className="relative mr-4 flex-shrink-0">
                    <img
                      className="h-9 w-9 rounded-full object-cover"
                      src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ=w240-h480-rw"
                    />
                    <div
                      className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-green-500 "
                      style={{
                        border: " 3px solid #1e1f22",
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-white">
                      {currUser?.username}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-row justify-end">
                  {isOpenMic ? (
                    <MicIcon
                      className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                      onClick={() => setIsOpenMic(!isOpenMic)}
                    />
                  ) : (
                    <MicOffIcon
                      className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                      onClick={() => setIsOpenMic(!isOpenMic)}
                    />
                  )}
                  {isOpenCamera ? (
                    <VideocamIcon
                      className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                      onClick={() => setIsOpenCamera(!isOpenCamera)}
                    />
                  ) : (
                    <VideocamOffIcon
                      className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                      onClick={() => setIsOpenCamera(!isOpenCamera)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{errorContent}</Alert>
      </Snackbar>
    </div>
  );
};

export default ChatList;
