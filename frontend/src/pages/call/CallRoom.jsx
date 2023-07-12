import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import AgoraUIKit from "agora-react-uikit";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_ID } from "../../utils/constants";
import { genRTCToken } from "../../api";
import Box from "@mui/material/Box";
import { useCall } from "../../contexts/callContext";
import { ChatState } from "../../StateProvider";

const END_POINT = import.meta.env.VITE_END_POINT_CERT;

const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chat_id") || "";
const chatType = urlParams.get("type") || "";
const isInvited = urlParams.get("invite") || "";

const CallPage = () => {
  const { user } = ChatState();
  console.log("user: ", user);
  const [RTCToken, setRTCToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { call } = useCall();

  const [socketState, setSocketState] = useState({
    socket: null,
    isConnected: false,
  });

  console.log("call: ", call);
  useEffect(() => {
    if (!user) return;
    const socket = io(END_POINT, {
      query: {
        token: user.token,
        page: "call",
      },
    });

    setSocketState((prevState) => ({
      ...prevState,
      socket: socket,
    }));

    socket.on("connect", () => {
      console.log("socket connected");
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
      socketState.socket?.emit("leave call", chatId);
      window.close();
    },
  };

  useEffect(() => {
    setIsLoading(true);
    if (!socketState.isConnected) return;
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
