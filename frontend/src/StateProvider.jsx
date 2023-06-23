import { createContext, useContext, useEffect, useState } from "react";
import { logout } from "./components/Auth";
import { useNavigate } from "react-router-dom";
import { getAllChat } from "./api";
const ChatContext = createContext();

const StateProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [listChat, setListChat] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);
    if (!userInfo) navigate("/login");
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
