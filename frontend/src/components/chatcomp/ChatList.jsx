import React, { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import { Snackbar, Alert, Stack } from "@mui/material";
import { getAllChat } from "../../api";
import ChatLoading from "./ChatLoading";

const ChatList = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, listChat, setListChat } =
    ChatState();
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[0].username : users[1].username;
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
  }, []);

  return (
    <div className="container flex w-[500px] flex-col items-center rounded-lg bg-secondary p-2">
      <div className="flex w-full items-center justify-between px-2 pb-2 text-4xl">
        My Chats
        <button className="btn-primary btn border-none bg-btn">
          Create Group Chat <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="flex h-full w-full flex-col overflow-y-hidden rounded-lg bg-primary p-2">
        {listChat ? (
          <Stack spacing={1} className="overflow-y-scroll no-scrollbar">
            {listChat.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer h-16 px-2 py-1 rounded-lg ${selectedChat===chat ? 'bg-btn' : 'bg-secondary'} hover:bg-zinc-600`}
                key={chat._id}
              >
                <span className="font-bold text-lg">{!chat.isGroup ? getSender(loggedUser, chat.users) : chat.chatName}</span> 
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
