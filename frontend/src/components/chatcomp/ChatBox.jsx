import React from "react";
import { ChatState } from "../../StateProvider";
import SingleChat from "./SingleChat";



const ChatBox = ({ fetch, setFetch }) => {
  const { selectedChat } = ChatState();

  return (
    <div className="mx-1 flex w-full flex-col items-center rounded-lg border-[2px] border-text px-3 py-3">
      <SingleChat fetch={fetch} setFetch={setFetch} />
    </div>
  );
};

export default ChatBox;
