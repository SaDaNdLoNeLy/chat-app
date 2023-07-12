import { useCall } from "../contexts/callContext";
import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../StateProvider";
function CallModal({ socketState }) {
  const { call, setIsCalling } = useCall();
  const { user } = ChatState();
  const [isTurnOff, setIsTurnOff] = useState(false);
  console.log(call);
  const handleJoinCall = () => {
    socketState.socket.emit("join call", call.chatId);
    setIsTurnOff(true);
    setIsCalling(true);
    window.open(call.joinLink + "&invite=true", "_blank").focus();
  };
  const handleClicked = () => {
    console.log("clicked");
    setIsTurnOff(true);
    setIsCalling(false);
  };
  // useEffect(() => {},);
  return (
    <dialog
      id="my_modal_2"
      className="modal"
      open={user && call.caller && call.caller !== user.username && !isTurnOff}
    >
      <form method="dialog" className="modal-box">
        <div className=" flex flex-row items-center justify-center py-4">
          {call.caller} create call video
        </div>
        <HStack className="justify-between">
          <button
            className="bg-red-400 px-2 py-1"
            onClick={() => handleClicked()}
          >
            Close
          </button>
          <button
            className="bg-green-400 px-2 py-1"
            onClick={() => handleJoinCall()}
          >
            Join
          </button>
        </HStack>
      </form>
      <form method="dialog" className="modal-backdrop">
        <div onClick={() => handleClicked()}>close</div>
      </form>
    </dialog>
  );
}

export default CallModal;
