import React, { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import { Snackbar, Alert, Stack } from "@mui/material";
import { getAllChat } from "../../api";
import ChatLoading from "./ChatLoading";
import GroupChatPopup from "./GroupChatPopup";

const ChatList = ({ fetch }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, listChat, setListChat } =
    ChatState();
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id
      ? users[1].username
      : users[0].username;
  };

  const fetchChat = async () => {
    try {
      const response = await getAllChat(user._id);
      console.log(response.data);
      setListChat(response.data);
    } catch (err) {
      setOpen(true);
      setErrorContent("Failed to load chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChat();
  }, [fetch]);

  return (
    <div className="container flex w-[500px] flex-col items-center rounded-lg bg-secondary p-2">
      <div className="flex w-full items-center justify-between px-2 pb-2 text-3xl text-white">
        MyChats
        <GroupChatPopup />
      </div>
      <div className="flex h-full w-full flex-col overflow-y-hidden rounded-lg bg-primary p-2">
        {listChat ? (
          <Stack spacing={1} className="no-scrollbar overflow-y-scroll">
            {listChat.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`h-16 cursor-pointer rounded-lg px-2 py-1 ${
                  selectedChat === chat ? "bg-btn" : "bg-secondary"
                } hover:bg-zinc-600`}
                key={chat._id}
              >
                <span className="m-2 text-lg font-bold text-white">
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </span>
              </div>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
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
