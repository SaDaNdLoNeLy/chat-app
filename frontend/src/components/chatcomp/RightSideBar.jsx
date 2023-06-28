import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Stack } from "@mui/material";
function RightSideBar({
  selectedChat,
  currUser,
  setHoverCharCard,
  isOpenMic,
  setIsOpenMic,
  isOpenCamera,
  setIsOpenCamera,
}) {
  const selectedChatOtherUsers = selectedChat?.users.filter(
    (u) => u._id !== currUser.id
  );
  return (
    <Stack className="no-scrollbar relative h-full w-full overflow-y-scroll bg-zinc-800 pt-2">
      <div className="flex h-full flex-col">
        <div
          className="sticky -top-2 z-10 box-border flex w-full flex-col bg-zinc-800 py-2 
        shadow-slate-50"
        >
          {/* <OutlinedInput
          placeholder="Find your friends"
          className=" w-11/12"
          sx={{
            color: "white",
            backgroundColor: "#1e1f22",
            alignSelf: "center",
          }}
        /> */}
          <label
            htmlFor="my-drawer"
            className="btn-primary drawer-button btn h-10 w-40 self-center border-none bg-btn"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span className="hidden md:block">Search User</span>
          </label>
        </div>

        <div className="ml-2 mt-2 cursor-pointer font-medium hover:text-zinc-300">
          {selectedChat?.isGroup && "Online Users".toUpperCase()}
        </div>
        <div className="ml-2 mt-2 flex flex-1 flex-col">
          {selectedChat?.isGroup &&
            selectedChatOtherUsers?.length !== 0 &&
            selectedChatOtherUsers?.map((user) => (
              <div
                className="mb-2 flex cursor-pointer flex-row items-center rounded-xl p-2 hover:bg-zinc-600"
                key={user._id}
                onMouseEnter={() => {
                  setHoverCharCard(user._id);
                }}
                onMouseLeave={() => {
                  setHoverCharCard(null);
                }}
              >
                <div className="relative mr-4 flex-shrink-0">
                  {user.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatar}
                    />
                  ) : (
                    <div
                      className={
                        "flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full bg-zinc-600"
                      }
                    >
                      <span className="m-2 select-none text-xl font-bold text-white">
                        {user.username.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {user.status === 1 ? (
                    <div
                      className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-green-500 "
                      style={{
                        border: " 3px solid #1e1f22",
                      }}
                    />
                  ) : (
                    <div
                      className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-gray-500 "
                      style={{
                        border: " 3px solid #1e1f22",
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-row items-center justify-between">
                  <div className="flex flex-col items-start justify-center ">
                    <div className="font-semibold text-white">
                      {user.username}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="sticky -bottom-1 bg-secondary px-2 py-3">
          <div className="flex flex-row items-center justify-between">
            <div className="mr-4 flex flex-grow cursor-pointer flex-row items-center rounded-md p-2 hover:bg-zinc-600">
              <div className="relative mr-4 flex-shrink-0">
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  src="https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ=w240-h480-rw"
                />
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
            <div className="flex flex-1 flex-row justify-end">
              {isOpenMic ? (
                <MicIcon
                  className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                  onClick={() => setIsOpenMic(!isOpenMic)}
                />
              ) : (
                <MicOffIcon
                  className="mr-1 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                  onClick={() => setIsOpenMic(!isOpenMic)}
                />
              )}
              {isOpenCamera ? (
                <VideocamIcon
                  className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                  onClick={() => setIsOpenCamera(!isOpenCamera)}
                />
              ) : (
                <VideocamOffIcon
                  className="mr-2 box-content cursor-pointer rounded-md p-1 text-white hover:bg-zinc-600"
                  onClick={() => setIsOpenCamera(!isOpenCamera)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
}

export default RIghtSideBar;
