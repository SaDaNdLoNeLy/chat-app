import React, { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import { Snackbar, Alert } from "@mui/material";

// import ToolTip from "../ToolTip";
import { getAllChat } from "../../api";
import ChatLoading from "./ChatLoading";
import GroupChatPopup from "./GroupChatPopup";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

const myTransition = "transition-all duration-500 ease-in-out";

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
  // console.log("selectedChatOtherUsers", selectedChatOtherUsers);
  return (
    <div className="container flex w-[500px] flex-col items-center rounded-lg bg-secondary p-2">
      <div className="flex w-full items-center justify-between px-2 pb-2 text-3xl text-white">
        MyChats
        <GroupChatPopup />
      </div>
      <div className="flex h-full w-full flex-row overflow-y-hidden rounded-lg bg-primary">
        {listChat ? (
          <LeftSideBar
            listChat={listChat}
            hoverImgIdx={hoverImgIdx}
            selectedChat={selectedChat}
            myTransition={myTransition}
            loggedUser={loggedUser}
            setSelectedChat={setSelectedChat}
            setHoverImgIdx={setHoverImgIdx}
            getSender={getSender}
          />
        ) : (
          <ChatLoading />
        )}
        <RightSideBar
          selectedChat={selectedChat}
          currUser={currUser}
          setHoverCharCard={setHoverCharCard}
          isOpenMic={isOpenMic}
          setIsOpenMic={setIsOpenMic}
          isOpenCamera={isOpenCamera}
          setIsOpenCamera={setIsOpenCamera}
        />
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
