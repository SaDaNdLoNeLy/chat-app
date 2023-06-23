import React, { useState } from "react";
import { Modal, Snackbar, Alert } from "@mui/material";
import { ChatState } from "../../StateProvider";
import { searchUser, createGroup } from "../../api";
import UserListItem from "./UserListItem";
import UserBadge from "./UserBadge";

const GroupChatPopup = () => {
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, listChat, setListChat } = ChatState();

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
    } catch (err) {
      setOpen(true);
      setErrorContent("Failed to load search result");
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setOpen(true);
      setErrorContent("Please fill all the field");
    }

    try {
      const response = await createGroup(groupChatName, selectedUsers);
      setListChat([response.data, ...listChat]);
      setOpen(true);
      setErrorContent("New group chat created")
    } catch (err) {
      setOpen(true);
      setErrorContent("Failed to create group chat")
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setOpen(true);
      setErrorContent("User is already added");
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(
      selectedUsers.filter((select) => select._id !== deleteUser._id)
    );
  };

  return (
    <>
      <button
        className="btn-primary btn border-none bg-btn"
        onClick={() => window.creategrouppopup.showModal()}
      >
        Create Group Chat <i className="fa-solid fa-plus"></i>
      </button>
      <dialog id="creategrouppopup" className="modal">
        <form method="dialog" className="modal-box">
          <h2 className="mb-4 text-2xl font-bold">Create Group Chat</h2>
          <div>
            <input
              type="text"
              placeholder="Enter group chat name"
              className="input my-2 w-full max-w-4xl border border-text"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter username for adding"
              className="input my-2 w-full max-w-4xl border border-text"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {selectedUsers.map((user) => (
            <UserBadge
              key={user._id}
              user={user}
              handleFunction={() => handleDelete(user)}
            />
          ))}
          {loading ? (
            <div className="text-center text-lg">loading...</div>
          ) : (
            searchResult
              .slice(0, 3)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={handleSubmit}>
              Create Group
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

export default GroupChatPopup;
