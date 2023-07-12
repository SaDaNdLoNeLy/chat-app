import { CHAT_TYPE } from "../../utils/constants";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";

const MessageBubble = ({ m, handleJoinCall }) => {
  switch (m?.chatType) {
    case CHAT_TYPE.TEXT:
      return <div className="chat-bubble text-white">{m.content}</div>;
    // case CHAT_TYPE.AUDIO:
    //   return (
    //     <div
    //       className={`chat-bubble  text-white ${
    //         isLastCall && "cursor-pointer hover:bg-btn"
    //       }`}
    //       onClick={() => isLastCall && handleJoinCall(m.chatType)}
    //     >
    //       {isLastCall ? (
    //         <MicIcon className="mr-1 box-content cursor-pointer rounded-md p-1 text-white " />
    //       ) : (
    //         <MicOffIcon className="mr-1 box-content rounded-md p-1 text-white " />
    //       )}
    //       <span>{!m.chat.isGroup ? "" : "Group"} Audio Call</span>
    //     </div>
    //   );
    case CHAT_TYPE.VIDEO:
      return (
        <div
          className={` chat-bubble
             cursor-pointer text-white
          hover:bg-btn`}
          onClick={() => handleJoinCall(m.chatType)}
        >
          <VideocamIcon className="mr-2 box-content rounded-md p-1 text-white" />

          {/* <VideocamOffIcon className="mr-2 box-content  rounded-md p-1 text-white" /> */}
          <span>{!m.chat.isGroup ? "" : "Group"} Video Call</span>
        </div>
      );
    default:
      return <></>;
  }
};

export default MessageBubble;
