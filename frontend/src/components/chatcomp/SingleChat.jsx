import { useEffect, useState } from "react";
import { ChatState } from "../../StateProvider";
import UpdateGroupPopup from "./UpdateGroupPopup";
import { sendMsg, getMsg } from "../../api";
import ChatBadge from "./ChatBadge";
import { getSender } from "../../utils/chat";
import SendIcon from "@mui/icons-material/Send";
import { HStack } from "@chakra-ui/react";
import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { CHAT_TYPE } from "../../utils/constants";
import { useCall } from "../../contexts/callContext";
const END_POINT = import.meta.env.VITE_END_POINT_CERT;
let selectedChatCompare;

const SingleChat = ({ fetch, setFetch, socketState, newTabsRef }) => {
  const { user, selectedChat, changeCurrentCallInChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, isConnected: isSocketConnected } = socketState;
  const {
    call,
    setCaller,
    setJoinLink,
    setIsCalling,
    setChatId,
    setIsGroup,
    setIsCancel,
    resetCall,
    setMessageId,
    setFriendName,
    setIsTurnOffModal,
  } = useCall();

  console.log("newTabsRef.current: ", newTabsRef.current);
  console.log("call state: ", call);
  // console.log("selectedChat: ", selectedChat);
  useEffect(() => {
    if (!isSocketConnected) return;
    setSocketConnected(true);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on(
      "invite call",
      (inviteUser, chatId, joinLink, isGroup, messageId) => {
        console.log("invite call: ", inviteUser, chatId, joinLink);
        setCaller(inviteUser);
        setJoinLink(joinLink);
        setChatId(chatId);
        setIsGroup(isGroup);
        setMessageId(messageId);
      }
    );

    socket.on("leaved call", (leavedUser, chatId, isGroup) => {
      console.log("leaved call: ", user, chatId, isGroup);
      if (leavedUser.userId === user.id) {
        resetCall();
        newTabsRef.current.pop();
      }
      if (!isGroup && leavedUser.userId !== user.id) {
        resetCall();
        newTabsRef.current[0].close();
        newTabsRef.current.pop();
      }
    });

    socket.on("change current call", (chatId, isCalling, joinLink) => {
      console.log("change current call: ", chatId, isCalling, joinLink);
      changeCurrentCallInChat(chatId, {
        isCalling: isCalling,
        joinLink: joinLink,
      });
    });

    socket.on("cancel call", (friendName) => {
      console.log("cancel call", friendName);
      setIsCancel(true);
      setFriendName(friendName);
    });

    socket.on("accept call p2p", (joinLink) => {
      setIsCalling(true);
      setIsTurnOffModal(true);
      newTabsRef.current.push(window.open(joinLink, "_blank"));
      newTabsRef.current[0].focus();
    });

    socket.on("message received", (newMessage) => {
      console.log("message received: ", newMessage);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // Notification
      } else {
        setMessages((prevState) => [...prevState, newMessage]);
      }
    });

    return () => {
      // localStorage.setItem("callTab", JSON.stringify(newTabsRef.current));
      socket.off("typing");
      socket.off("stop typing");
      socket.off("invite call");
      socket.off("message received");
      socket.off("leaved call");
      socket.off("change current call");
      socket.off("cancel call");
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
      console.log("allmess: ", response.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getAllMessages();

    if (
      selectedChat &&
      selectedChat.currentCall.participants.find((p) => p === user.id)
    ) {
      setCaller(null);
      setJoinLink(selectedChat.currentCall.joinLink);
      setChatId(selectedChat._id);
      setIsCalling(true);
      setIsGroup(selectedChat.isGroup);
      // newTabsRef.current.push(
      //   window.open(selectedChat.currentCall.joinLink, "_blank")
      // );
      // newTabsRef.current[0].focus();
    }
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
        setMessages((prevState) => [...prevState, response.data]);
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
      setMessages((prevState) => [...prevState, newMessage]);
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

  const handleCallGroupClick = async (chatType) => {
    if (!selectedChat) return;
    try {
      const response = await sendMsg(selectedChat._id, "", chatType);
      setMessages([...messages, response.data]);
      const joinLink =
        window.location.origin +
        "/call?chat_id=" +
        selectedChat._id +
        "&message_id=" +
        response.data._id +
        "&type=" +
        chatType +
        "&isGroup=" +
        selectedChat.isGroup;

      setCaller(user);
      setJoinLink(joinLink);
      setIsCalling(true);
      setChatId(selectedChat._id);
      setIsGroup(selectedChat.isGroup);

      socket.emit("send message", response.data);

      newTabsRef.current.push(window.open(joinLink, "_blank"));
      // pushNewTab(window.open(joinLink, "_blank"));
      newTabsRef.current[0].focus();
    } catch (error) {}
  };

  const handleCallClick = async (chatType) => {
    if (!selectedChat) return;
    try {
      const response = await sendMsg(selectedChat._id, "", chatType);
      setMessages([...messages, response.data]);
      const joinLink =
        window.location.origin +
        "/call?chat_id=" +
        selectedChat._id +
        "&message_id=" +
        response.data._id +
        "&type=" +
        chatType +
        "&isGroup=" +
        selectedChat.isGroup;

      setCaller(user);
      setJoinLink(joinLink);
      setChatId(selectedChat._id);
      setIsGroup(selectedChat.isGroup);
      setIsCancel(false);
      setMessageId(response.data._id);

      socket.emit(
        "send call p2p",
        selectedChat._id,
        joinLink,
        response.data._id
      );
      socket.emit("send message", response.data);
    } catch (error) {}
  };

  const handleJoinCall = (chatType, messageId) => {
    if (call.isCalling && selectedChat._id === call.chatId) {
      newTabsRef.current[0].focus();
      return;
    }

    const joinLink =
      window.location.origin +
      "/call?chat_id=" +
      selectedChat._id +
      "&message_id=" +
      messageId +
      "&type=" +
      chatType +
      "&isGroup=" +
      selectedChat.isGroup;

    setCaller(null);
    setJoinLink(joinLink);
    setIsCalling(true);
    setChatId(selectedChat._id);
    setIsGroup(selectedChat.isGroup);
    setIsCancel(false);
    setMessageId(messageId);

    newTabsRef.current.push(window.open(joinLink, "_blank"));
    // pushNewTab(window.open(joinLink, "_blank"));
    newTabsRef.current[0].focus();
  };

  const createCurrentCallGroupButton = () => {
    // console.log("selectedChat.currentCall: ", selectedChat.currentCall);
    if (selectedChat.currentCall.isCalling) {
      if (call.isCalling && selectedChat._id === call.chatId) {
        return (
          <div className="select-none rounded-lg bg-gray-400 px-2 py-1">
            Joined
          </div>
        );
      } else if (call.isCalling) {
        return (
          <IconButton onClick={() => {}}>
            <VideocamOffIcon className="cursor-pointer text-white" />
          </IconButton>
        );
      } else if (!call.isCalling) {
        return (
          <div
            className="cursor-pointer rounded-lg bg-green-400 px-2 py-1"
            onClick={() => {
              setCaller(null);
              setJoinLink(selectedChat.currentCall.joinLink);
              setChatId(selectedChat._id);
              setIsCalling(true);
              setIsGroup(selectedChat.isGroup);

              newTabsRef.current.push(
                window.open(selectedChat.currentCall.joinLink, "_blank")
              );
              newTabsRef.current[0].focus();
            }}
          >
            Join
          </div>
        );
      }
    } else {
      if (call.isCalling) {
        return (
          <IconButton onClick={() => {}}>
            <VideocamOffIcon className="cursor-pointer text-white" />
          </IconButton>
        );
      }
      return (
        <IconButton onClick={() => handleCallGroupClick(CHAT_TYPE.VIDEO)}>
          <VideocamIcon className="cursor-pointer text-white" />
        </IconButton>
      );
    }
  };

  const createCurrentCallButton = () => {
    if (call.isCalling) {
      if (
        call.chatId === selectedChat._id &&
        selectedChat.currentCall.isCalling
      ) {
        return (
          <div className="select-none rounded-lg bg-gray-400 px-2 py-1">
            Joined
          </div>
        );
      } else {
        return (
          <IconButton onClick={() => {}}>
            <VideocamOffIcon className="cursor-pointer text-white" />
          </IconButton>
        );
      }
    } else {
      if (selectedChat.currentCall && selectedChat.currentCall.isCalling) {
        return (
          <div className="select-none rounded-lg bg-green-400 px-2 py-1">
            Calling
          </div>
        );
      } else
        return (
          <IconButton onClick={() => handleCallClick(CHAT_TYPE.VIDEO)}>
            <VideocamIcon className="cursor-pointer text-white" />
          </IconButton>
        );
    }
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
                {createCurrentCallGroupButton()}
                <UpdateGroupPopup fetch={fetch} setFetch={setFetch} />
              </HStack>
            ) : (
              <HStack spacing={10} marginRight={10}>
                {createCurrentCallButton()}
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
