import { createContext, useContext, useState } from "react";

const initState = {
  caller: null,
  joinLink: null,
  chatId: null,
  messageId: null,
  isCalling: false,
  isTurnOffModal: false,
  isGroup: null,
  isCancel: null,
  friendName: null,
};

const CallContext = createContext(initState);

const CallProvider = ({ children }) => {
  const [call, setCall] = useState(initState);

  const setCaller = (caller) => {
    setCall((prevState) => ({ ...prevState, caller: caller }));
  };

  const setJoinLink = (joinLink) => {
    setCall((prevState) => ({ ...prevState, joinLink: joinLink }));
  };

  const setChatId = (chatId) => {
    setCall((prevState) => ({ ...prevState, chatId: chatId }));
  };

  const setIsCalling = (isCalling) => {
    setCall((prevState) => ({ ...prevState, isCalling: isCalling }));
  };

  const setIsTurnOffModal = (isTurnOffModal) => {
    setCall((prevState) => ({ ...prevState, isTurnOffModal: isTurnOffModal }));
  };

  const setIsGroup = (isGroup) => {
    setCall((prevState) => ({ ...prevState, isGroup: isGroup }));
  };

  const setIsCancel = (isCancel) => {
    setCall((prevState) => ({ ...prevState, isCancel: isCancel }));
  };

  const setMessageId = (messageId) => {
    setCall((prevState) => ({ ...prevState, messageId: messageId }));
  };
  const setFriendName = (friendName) => {
    setCall((prevState) => ({ ...prevState, friendName: friendName }));
  };
  const resetCall = () => {
    setCall(initState);
  };

  return (
    <CallContext.Provider
      value={{
        call,
        setCaller,
        setJoinLink,
        resetCall,
        setIsCalling,
        setChatId,
        setIsTurnOffModal,
        setIsGroup,
        setIsCancel,
        setMessageId,
        setFriendName,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

export default CallProvider;
