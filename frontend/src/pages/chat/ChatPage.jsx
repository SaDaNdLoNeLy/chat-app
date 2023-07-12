import { useEffect, useRef } from "react";
import ChatBox from "../../components/chatcomp/ChatBox";
import ChatList from "../../components/chatcomp/ChatList/ChatList";
import SideSearch from "../../components/chatcomp/SideSearch";
import { logout } from "../../components/Auth";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authAction";
import { ChatState } from "../../StateProvider";
import { useState } from "react";
import { io } from "socket.io-client";
import CallModal from "../../components/CallModal";

const END_POINT = import.meta.env.VITE_END_POINT_CERT;
const ChatPage = () => {
  const [fetch, setFetch] = useState(false);
  const { user } = ChatState();
  const { changeStatusUserInChat } = ChatState();
  const [socketState, setSocketState] = useState({
    socket: null,
    isConnected: false,
  });
  useEffect(() => {
    if (user) {
      const socket = io(END_POINT, {
        query: {
          token: user.token,
          page: "chat",
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

      socket.on("user change status", (userId, chatId, status) => {
        // console.log("user change status", userId, chatId, status);
        changeStatusUserInChat(userId, chatId, status);
      });
    }
    return () => {
      socketState.socket?.off("change online status");
      socketState.socket?.off("user change status");
      socketState.socket?.disconnect();
    };
  }, [user]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-primary">
      {user && <SideSearch />}
      <div className="flex h-[92%] w-screen justify-between p-2">
        {user && (
          <ChatList fetch={fetch} isSocketConnected={socketState.isConnected} />
        )}
        {user && (
          <ChatBox
            fetch={fetch}
            setFetch={setFetch}
            socketState={socketState}
          />
        )}
      </div>
      <CallModal socketState={socketState} />
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(ChatPage);
