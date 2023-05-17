import React, { useState } from "react";
import { ChatState } from "../../StateProvider";
import UserBadge from "./UserBadge";
import { renameGroup, searchUser, addUser, removeUser } from "../../api";
import UserListItem from "./UserListItem";
import { Snackbar, Alert } from "@mui/material";

const UpdateGroupPopup = ({ fetch, setFetch }) => {
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleUpdate = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const response = await renameGroup(selectedChat._id, groupChatName);
      setSelectedChat(response.data);
      console.log(response.data);
      setFetch(!fetch);
      setRenameLoading(false);
    } catch (err) {}
    setGroupChatName("");
  };

  const handleSearch = async (input) => {
    setSearch(input);
    if (!input) {
      return;
    }

    try {
      setLoading(true);
      const response = await searchUser(search);
      setLoading(false);
      setSearchResult(response.data);
      console.log(response.data);
    } catch (err) {}
  };

  const handleAddUser = async (userInput) => {
    if (selectedChat.users.find((u) => u._id === userInput._id)) {
      setOpen(true);
      setErrorContent("User is already in the group");
      return;
    }

    try {
      setLoading(true);

      const response = await addUser(selectedChat._id, userInput._id);
      setSelectedChat(response.data);
      setFetch(!fetch);
      setLoading(false);
    } catch (err) {}
  };

  const handleRemoveUser = async (userInput) => {
    if (selectedChat.groupAdmin._id !== user.id) {
      setOpen(true);
      setErrorContent("Only group admin can remove user");
      return;
    }

    try {
      setLoading(true);

      const response = await removeUser(selectedChat._id, userInput._id);
      userInput._id === user._id
        ? setSelectedChat()
        : setSelectedChat(response.data);
      setFetch(!fetch);
      setLoading(false);
    } catch (error) {}
  };

  return (
    <>
      <button className="btn" onClick={() => window.my_modal_1.showModal()}>
        <i className="fa-sharp fa-solid fa-pen text-base text-white"></i>
      </button>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-2xl font-bold">{selectedChat.chatName}</h3>
          <div>
            {selectedChat.users.map((user) => (
              <UserBadge
                key={user._id}
                user={user}
                handleFunction={() => handleRemoveUser(user)}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter new group name"
            className="input my-2 w-full max-w-4xl border border-text"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter username for adding"
            className="input my-2 w-full max-w-4xl border border-text"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            searchResult
              .slice(0, 3)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn bg-green-600 text-white hover:bg-green-800"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="btn bg-red-600 text-white hover:bg-red-800"
              onClick={() => handleRemoveUser(user)}
            >
              Leave Group
            </button>
          </div>
        </form>
      </dialog>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{errorContent}</Alert>
      </Snackbar>
    </>
  );
};

export default UpdateGroupPopup;
