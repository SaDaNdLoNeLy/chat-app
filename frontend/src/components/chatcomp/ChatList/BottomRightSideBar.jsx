import { useState } from "react";

import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import Tooltip from "@mui/material/Tooltip";

function BottomRightSideBar({ currUser }) {
  const [isTurnOnMic, setMic] = useState(true);
  const [isTurnOnCam, setCam] = useState(true);
  return (
    <div className="sticky -bottom-1 bg-secondary px-2 py-3">
      <div className="flex flex-row items-center justify-between">
        <div className="mr-4 flex flex-grow cursor-pointer flex-row items-center rounded-md p-2 hover:bg-zinc-600">
          <div className="relative mr-4 flex-shrink-0">
            <div className="flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-full bg-zinc-800">
              <span className="m-2 select-none text-xl font-bold text-white">
                {currUser.username.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div
              className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-green-500 "
              style={{
                border: " 3px solid #1e1f22",
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm text-white">{currUser?.username}</div>
          </div>
        </div>
        <div className="mr-1 flex flex-1 flex-row items-center justify-end ">
          {/* <Tooltip title="Microphone" arrow placement="top">
            {isTurnOnMic ? (
              <MicIcon
                className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                onClick={() => setMic(false)}
              />
            ) : (
              <MicOffIcon
                className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                onClick={() => setMic(true)}
              />
            )}
          </Tooltip>
          <Tooltip title="Camera" arrow placement="top">
            {isTurnOnCam ? (
              <VideocamIcon
                className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                onClick={() => setCam(false)}
              />
            ) : (
              <VideocamOffIcon
                className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                onClick={() => setCam(true)}
              />
            )}
          </Tooltip> */}
        </div>
      </div>
    </div>
  );
}

export default BottomRightSideBar;
