import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ChatState } from "../../StateProvider";
import UpdateGroupPopup from "./UpdateGroupPopup";
import { sendMsg, getMsg } from "../../api";
import ChatBadge from "./ChatBadge";
import io from "socket.io-client";
import { getSender } from "../../utils/chat";
import SendIcon from "@mui/icons-material/Send";
import { HStack } from "@chakra-ui/react";
import { IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { CHAT_TYPE } from "../../utils/constants";
import { useCall } from "../../contexts/callContext";
const END_POINT = import.meta.env.VITE_END_POINT_CERT;
let selectedChatCompare;

const SingleChat = ({ fetch, setFetch, socketState }) => {
  const { user, selectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, isConnected: isSocketConnected } = socketState;
  const { call, setCaller, setJoinLink, setIsCalling, setChatId } = useCall();
  console.log("call state: ", call);
  // console.log("selectedChat: ", selectedChat);
  useEffect(() => {
    if (!isSocketConnected) return;
    setSocketConnected(true);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("invite call", (username, chatId, joinLink) => {
      setCaller(username);
      setJoinLink(joinLink);
      setChatId(chatId);
    });
    socket.on("leaved call", (userId, chatId) => {
      console.log("leaved call: ", userId, chatId);
    });

    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // Notification
      } else {
        setMessages([...messages, newMessage]);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop typing");
      socket.off("invite call");
      socket.off("message received");
    };
  }, [isSocketConnected]);

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
    } catch (error) {}
  };

  useEffect(() => {
    getAllMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (e) => {
    console.log("e key :", e.key);
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const response = await sendMsg(
          selectedChat._id,
          newMessage,
          CHAT_TYPE.TEXT
        );
        // console.log(response.data);
        socket.emit("send message", response.data);
        setNewMessage("");
        setMessages([...messages, response.data]);
      } catch (error) {}
    }
  };

  const handleSendMessClick = async () => {
    if (newMessage.trim().length === 0) return;
    socket.emit("stop typing", selectedChat._id);
    try {
      const response = await sendMsg(
        selectedChat._id,
        newMessage,
        CHAT_TYPE.TEXT
      );
      // console.log(response.data);
      socket.emit("send message", response.data);
      setNewMessage("");
      setMessages([...messages, response.data]);
    } catch (error) {}
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    const timer = 2000;
    setTimeout(() => {
      let now = new Date().getTime();
      let dur = now - lastTyping;
      if (dur >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
      }
    }, timer);
  };

  const handleCallClick = async (chatType) => {
    if (!selectedChat) return;
    try {
      const response = await sendMsg(selectedChat._id, "", chatType);
      // console.log(response.data);
      setMessages([...messages, response.data]);
      const joinLink =
        window.location.origin +
        "/call?chat_id=" +
        selectedChat._id +
        "&type=" +
        chatType;
      setCaller(user.username);
      setJoinLink(joinLink);
      setIsCalling(true);
      setChatId(selectedChat._id);

      socket.emit("send message", response.data, joinLink);

      window.open(joinLink, "_blank").focus();
    } catch (error) {}
  };

  const handleJoinCall = (chatType) => {
    // socket.emit("join call", selectedChat._id);
    // setIsShowModal(false);
    window
      .open(
        window.location.origin +
          "/call?chat_id=" +
          selectedChat._id +
          "&type=" +
          chatType,
        "_blank"
      )
      .focus();
  };
  return (
    <>
      {selectedChat ? (
        <>
          <div className="rounded-b-non flex w-full items-center justify-between rounded-lg py-4 pl-4 text-3xl font-bold text-white">
            <div>
              {!selectedChat.isGroup
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
            </div>
            {selectedChat.isGroup ? (
              <HStack spacing={10} marginRight={10}>
                {!call.caller || selectedChat._id !== call.chatId ? (
                  <IconButton onClick={() => handleCallClick(CHAT_TYPE.VIDEO)}>
                    <VideocamIcon className="cursor-pointer text-white" />
                  </IconButton>
                ) : !call.isCalling ? (
                  <div
                    className="cursor-pointer rounded-lg bg-green-400 px-2 py-1"
                    onClick={() => window.open(call.joinLink, "_blank").focus()}
                  >
                    Join
                  </div>
                ) : (
                  <div className="select-none rounded-lg bg-gray-400 px-2 py-1">
                    Joined
                  </div>
                )}
                <UpdateGroupPopup fetch={fetch} setFetch={setFetch} />
              </HStack>
            ) : (
              <HStack spacing={10} marginRight={10}>
                {!call.caller || selectedChat._id !== call.chatId ? (
                  <IconButton onClick={() => handleCallClick(CHAT_TYPE.VIDEO)}>
                    <VideocamIcon className="cursor-pointer text-white" />
                  </IconButton>
                ) : (
                  <div className="select-none rounded-lg bg-gray-400 px-2 py-1">
                    Joined
                  </div>
                )}
              </HStack>
            )}
          </div>
          <div className="no-scrollbar mx-4 mt-2 flex h-full w-full flex-col justify-end overflow-y-hidden rounded-lg bg-secondary p-4">
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <div className="no-scrollbar flex flex-col overflow-y-scroll">
                <ChatBadge
                  messages={messages}
                  handleJoinCall={handleJoinCall}
                />
              </div>
            )}
            {isTyping ? <span>loading...</span> : <></>}
            <HStack>
              <input
                type="text"
                placeholder="Type here"
                className="input h-16 flex-1 border-text"
                value={newMessage}
                onKeyDown={sendMessage}
                onChange={typingHandler}
              />
              <IconButton
                onClick={() => handleSendMessClick()}
                disabled={newMessage.trim().length === 0}
              >
                <SendIcon className="cursor-pointer text-white" />
              </IconButton>
            </HStack>
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
