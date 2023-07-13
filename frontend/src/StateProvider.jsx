import { createContext, useContext, useEffect, useState } from "react";
import { logout } from "./components/Auth";
import { useNavigate } from "react-router-dom";
import { getAllChat } from "./api";

const ChatContext = createContext();

const StateProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [listChat, setListChat] = useState([]);

  const changeStatusUserInChat = (userId, chatId, status) => {
    setSelectedChat((prevState) => {
      // console.log("changeStatusUserInChat", prevState);
      if (!prevState) return prevState;
      if (prevState._id === chatId) {
        const newUsers = prevState.users.map((user) => {
          if (user._id === userId) {
            return { ...user, status: status };
          }
          return user;
        });
        return { ...prevState, users: newUsers };
      }
      return prevState;
    });

    setListChat((prevState) => {
      const newChatList = prevState.map((chat) => {
        if (chat._id === chatId) {
          const newUsers = chat.users.map((user) => {
            if (user._id === userId) {
              return { ...user, status: status };
            }
            return user;
          });
          return { ...chat, users: newUsers };
        }
        return chat;
      });
      return newChatList;
    });
  };

  const changeCurrentCallInChat = (chatId, rest) => {
    setSelectedChat((prevState) => {
      if (!prevState) return prevState;
      if (prevState._id === chatId) {
        return {
          ...prevState,
          currentCall: {
            ...prevState.currentCall,
            ...rest,
          },
        };
      }
      return prevState;
    });

    setListChat((prevState) => {
      const newChatList = prevState.map((chat) => {
        if (chat._id === chatId) {
          return { ...chat, currentCall: { ...chat.currentCall, ...rest } };
        }
        return chat;
      });
      return newChatList;
    });
  };

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!userInfo) navigate("/login");
    else setUser(userInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        listChat,
        setSelectedChat,
        setListChat,
        changeStatusUserInChat,
        changeCurrentCallInChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default StateProvider;
