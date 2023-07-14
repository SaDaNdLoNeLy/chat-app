import { useCall } from "../contexts/callContext";
import { HStack } from "@chakra-ui/react";
import { ChatState } from "../StateProvider";
function CallModal({ socketState, newTabsRef }) {
  const { call, setIsCalling, resetCall, setIsTurnOffModal, setIsCancel } =
    useCall();
  const { user } = ChatState();
  // const {} =
  // console.log(call);
  const handleJoinCall = () => {
    setIsTurnOffModal(true);
    setIsCalling(true);
    if (!call.isGroup) {
      setIsCalling(true);
      socketState.socket.emit(
        "send accept call p2p",
        call.chatId,
        call.joinLink
      );
    }
    newTabsRef.current.push(window.open(call.joinLink, "_blank"));
    newTabsRef.current[0].focus();
  };
  const handleClicked = () => {
    // console.log("clicked");
    if (!call.isGroup && !call.isCancel) {
      console.log("send cancel call", call.chatId, call.messageId);
      socketState.socket.emit("send cancel call", call.chatId, call.messageId);
    }
    resetCall();
  };

  if (!call.caller || !user) return <></>;

  return call && call.isGroup ? (
    <dialog
      className="modal"
      open={
        user &&
        call.caller &&
        call.caller.id !== user.id &&
        !call.isTurnOffModal
      }
    >
      <form method="dialog" className="modal-box">
        <div className=" flex flex-row items-center justify-center py-4">
          {call.caller?.username} create call video
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
        <div onClick={() => handleClicked()}></div>
      </form>
    </dialog>
  ) : call.caller.id === user.id ? (
    <dialog className="modal" open={!call.isTurnOffModal}>
      <form method="dialog" className="modal-box">
        <div className=" flex flex-row items-center justify-center py-4 text-lg">
          {call.isCancel
            ? `${call.friendName} has canceled your call`
            : "Calling ..."}
        </div>
        <HStack className="justify-center">
          <button
            className="bg-red-400 px-2 py-1"
            onClick={() => handleClicked()}
          >
            Close
          </button>
        </HStack>
      </form>
      <form method="dialog" className="modal-backdrop">
        <div onClick={() => handleClicked()}></div>
      </form>
    </dialog>
  ) : (
    <dialog className="modal" open={!call.isTurnOffModal}>
      <form method="dialog" className="modal-box">
        <div className=" flex flex-row items-center justify-center py-4">
          {call.isCancel
            ? `${call.friendName} has canceled your call`
            : `${call.caller?.username} call you`}
        </div>
        {call.isCancel ? (
          <HStack className="justify-center">
            <button
              className="bg-red-400 px-2 py-1"
              onClick={() => handleClicked()}
            >
              Close
            </button>
          </HStack>
        ) : (
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
              Accept
            </button>
          </HStack>
        )}
      </form>
      <form method="dialog" className="modal-backdrop">
        <div onClick={() => handleClicked()}></div>
      </form>
    </dialog>
  );
}

export default CallModal;
