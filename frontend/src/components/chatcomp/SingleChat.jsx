import React, { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import UpdateGroupPopup from "./UpdateGroupPopup";
import { sendMsg, getMsg } from "../../api";
import ChatBadge from "./ChatBadge";
import io from "socket.io-client";
import { selectClasses } from "@mui/material";

const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id
    ? users[0].username
    : users[1].username;
};

const END_POINT = "http://localhost:8000";

let socket, selectedChatCompare;

const SingleChat = ({ fetch, setFetch }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, []);

  const getAllMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const response = await getMsg(selectedChat._id);
      setMessages(response.data);
      console.log(response.data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id)
    } catch (error) {}
  };

  useEffect(() => {
    getAllMessages();

    selectedChatCompare = selectedChat
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        // Notification
      } else {
        setMessages([...messages, newMessage])
      }
    })
  })

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const response = await sendMsg(selectedChat._id, newMessage);
        console.log(response.data);

        socket.emit("send message", response.data)
        setNewMessage("");
        setMessages([...messages, response.data]);
      } catch (error) {}
    }
  };


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime()
    const timer = 2000;
    setTimeout(() => {
      let now = new Date().getTime()
      let dur = now - lastTyping
      if (dur >= timer && typing) {
        socket.emit("stop typing", selectedChat._id)
      }
    }, timer)

  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="rounded-b-non flex w-full items-center justify-between rounded-lg pl-4 py-4 text-3xl font-bold text-white">
            {!selectedChat.isGroup
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName.toUpperCase()}
            {selectedChat.isGroup ? (
              <UpdateGroupPopup fetch={fetch} setFetch={setFetch} />
            ) : (
              <></>
            )}
          </div>
          <div className="no-scrollbar mx-4 mt-2 flex h-full w-full flex-col justify-end overflow-y-hidden rounded-lg bg-secondary p-4">
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <div className="no-scrollbar flex flex-col overflow-y-scroll">
                <ChatBadge messages={messages} />
              </div>
            )}
            {isTyping ? <span>loading...</span> : <></>}
            <input
              type="text"
              placeholder="Type here"
              className="input h-16 w-full border-text flex-shrink-0"
              value={newMessage}
              onKeyDown={sendMessage}
              onChange={typingHandler}
            />
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <h1 className="text-4xl">Click on a chat to start chatting</h1>
        </div>
      )}
    </>
  );
};

export default SingleChat;
