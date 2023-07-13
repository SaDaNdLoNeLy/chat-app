import { useCall } from "../contexts/callContext";
import { HStack } from "@chakra-ui/react";
import { ChatState } from "../StateProvider";
function CallModal({ socketState, newTabsRef }) {
  const { call, setIsCalling, resetCall, setIsTurnOffModal } = useCall();
  const { user } = ChatState();
  console.log(call);
  const handleJoinCall = () => {
    setIsTurnOffModal(true);
    setIsCalling(true);
    newTabsRef.current.push(window.open(call.joinLink, "_blank"));
    newTabsRef.current[0].focus();
  };
  const handleClicked = () => {
    // console.log("clicked");
    resetCall();
  };
  // useEffect(() => {},);
  return (
    <dialog
      id="my_modal_2"
      className="modal"
      open={
        user &&
        call.caller &&
        call.caller !== user.username &&
        !call.isTurnOffModal
      }
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
