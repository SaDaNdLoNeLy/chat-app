import { createContext, useContext, useState } from "react";

const initState = {
  caller: null,
  joinLink: null,
  chatId: null,
  isCalling: false,
  isTurnOffModal: false,
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
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

export default CallProvider;
