import { useState, useEffect } from "react";
import io from "socket.io-client";
import AgoraUIKit from "agora-react-uikit";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_ID } from "../../utils/constants";
import { genRTCToken } from "../../api";
import Box from "@mui/material/Box";
import { ChatState } from "../../StateProvider";

const END_POINT = import.meta.env.VITE_END_POINT_CERT;

const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chat_id") || "";
const chatType = urlParams.get("type") || "";
const messageId = urlParams.get("message_id") || "";
const isGroup = urlParams.get("isGroup") || "";

const joinLink = window.location.href;
const CallPage = () => {
  const { user } = ChatState();
  console.log("user: ", user);
  const [RTCToken, setRTCToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [socketState, setSocketState] = useState({
    socket: null,
    isConnected: false,
  });

  useEffect(() => {
    if (!user) return;
    const socket = io(END_POINT, {
      query: {
        token: user.token,
        page: "call",
        chatId,
        messageId,
        joinLink,
        isGroup,
      },
    });

    setSocketState((prevState) => ({
      ...prevState,
      socket: socket,
    }));

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("change online status", () => {
      setSocketState((prevState) => ({
        ...prevState,
        isConnected: true,
      }));
    });
  }, [user]);

  console.log("socketState: ", socketState);
  const callbacks = {
    EndCall: () => {
      // socketState.socket?.emit("leave call");
      window.close();
    },
  };

  useEffect(() => {
    setIsLoading(true);
    if (!socketState.isConnected) return;
    socketState.socket.emit("join call");
    genRTCToken(chatId)
      .then(({ uid, token }) => {
        setRTCToken(token);
        setUid(uid);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [socketState.isConnected]);
  // console.log({
  //   appId: APP_ID,
  //   channel: chatId, // your agora channel
  //   token: RTCToken,
  //   uid: uid,
  // });
  console.log("isLoading: ", isLoading);
  return !isLoading ? (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AgoraUIKit
        rtcProps={{
          appId: APP_ID,
          channel: chatId, // your agora channel
          token: RTCToken,
          uid: uid,
          layout: isGroup === "true" ? 1 : 0,
          displayUsername: true,
          username: user.username,
          enableScreensharing: true,
          activeSpeaker: true,
        }}
        callbacks={callbacks}
      />
    </div>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default CallPage;
