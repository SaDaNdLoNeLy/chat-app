import React from "react";
import { ChatState } from "../../StateProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetch, setFetch, socketState }) => {
  return (
    <div className="mx-1 flex w-full flex-col items-center rounded-lg border-[2px] border-text px-3 py-3">
      <SingleChat fetch={fetch} setFetch={setFetch} socketState={socketState} />
    </div>
  );
};

export default ChatBox;
