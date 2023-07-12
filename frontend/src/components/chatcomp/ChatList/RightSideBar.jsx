import { Stack, Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { ChatState } from "../../../StateProvider";
import { getChat } from "../../../api";
import BottomRightSideBar from "./BottomRightSideBar";

function RightSideBar({ selectedChat, currUser }) {
  const selectedChatOtherUsers = selectedChat?.users.filter(
    (u) => u._id !== currUser.id
  );
  const [userGroupIdx, setUserGroupIdx] = useState(null);
  const { listChat, setListChat, setSelectedChat } = ChatState();

  const handleClickGroupUser = async (id) => {
    const clickedUserChat = listChat.find(
      (c) => !c.isGroup && c.users.find((u) => u._id === id)
    );
    if (!clickedUserChat) {
      try {
        const response = await getChat(id);
        // console.log("rightSidebar getChat: ", response.data);
        if (!listChat.find((c) => c._id === response.data._id))
          setListChat([response.data, ...listChat]);
        setSelectedChat(response.data);
      } catch (err) {
        console.log(err);
      }
    } else setSelectedChat(clickedUserChat);
  };

  return (
    <Stack className="no-scrollbar relative h-full w-full overflow-y-scroll bg-zinc-800 pt-2">
      <div className="flex h-full flex-col">
        <div
          className="sticky -top-2 z-10 box-border flex w-full flex-col bg-zinc-800 p-2 
        shadow-slate-50"
        >
          <label
            htmlFor="my-drawer"
            className="btn-primary drawer-button btn h-10 w-full self-center border-none bg-btn"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span className="hidden md:block">Search User</span>
          </label>
        </div>

        <div className="ml-2 mt-2 cursor-pointer font-medium text-zinc-300">
          {selectedChat?.isGroup && "Online Users".toUpperCase()}
        </div>
        <div className="ml-2 mt-2 flex flex-1 flex-col">
          {selectedChat?.isGroup &&
            selectedChatOtherUsers?.length !== 0 &&
            selectedChatOtherUsers?.map((user) => (
              <div
                className="mb-2 flex cursor-pointer flex-row items-center rounded-xl p-2 hover:bg-zinc-600"
                key={user._id}
                onClick={() => {
                  handleClickGroupUser(user._id);
                }}
                onMouseEnter={() => {
                  setUserGroupIdx(user._id);
                }}
                onMouseLeave={() => {
                  setUserGroupIdx(null);
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
                      className={`flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full ${
                        userGroupIdx === user._id
                          ? "bg-zinc-800"
                          : "bg-zinc-600"
                      }`}
                    >
                      <span className="m-2 select-none text-xl font-bold text-white">
                        {user.username.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {user.status === "online" ? (
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
        <BottomRightSideBar currUser={currUser} />
      </div>
    </Stack>
  );
}

export default RightSideBar;
