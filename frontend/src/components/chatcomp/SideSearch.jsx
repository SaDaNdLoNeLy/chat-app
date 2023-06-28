import React, { useState } from "react";
import { logout } from "../Auth";
import { Snackbar, Alert } from "@mui/material";
import { searchUser, getChat } from "../../api";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../../StateProvider";

const SideSearch = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [open, setOpen] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const userString = localStorage.getItem("user");
  const { user, setSelectedChat, listChat, setListChat, selectedChat } =
    ChatState();

  const handleSearch = async () => {
    if (!search) {
      setOpen(true);
      setErrorContent("Cannot be empty");
    } else {
      try {
        setLoading(true);
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${user.token}`,
        //   },
        // };
        const response = await searchUser(search);
        console.log(response.data);
        setLoading(false);
        setSearchResult(response.data);
      } catch (err) {
        setOpen(true);
        setErrorContent(err.response.data);
      }
    }
  };

  const accessChat = async (id) => {
    try {
      setLoadingChat(true);
      const response = await getChat(id);
      console.log(response.data);
      if (!listChat.find((c) => c._id === response.data._id))
        setListChat([response.data, ...listChat]);

      setSelectedChat(response.data);
    } catch (error) {
      setOpen(true);
      setErrorContent("Cannot fetch chat. Pleas Try again");
    }
  };

  return (
    <div className="drawer z-20">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex items-center justify-between bg-secondary px-2 py-1">
        <div className="text-2xl font-bold">VISCORD</div>
        <div>
          <div className="dropdown-end dropdown-hover dropdown">
            <label tabIndex={0} className="btn m-1 bg-secondary">
              <i className="fa-sharp fa-solid fa-bell text-2xl"></i>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
          <div className="dropdown-end dropdown-hover dropdown border border-none">
            <label tabIndex={0} className="btn m-1 bg-secondary">
              <div className="placeholder avatar">
                <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
                  <span className="text-2xl">{user.username[0]}</span>
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a>My Profile</a>
              </li>
              <li>
                <a onClick={logout}>Log Out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu  h-full w-80 bg-base-200 p-4 text-base-content">
          {/* Sidebar content here */}
          <span className="mb-4 text-left text-2xl font-bold">
            Search For User
          </span>
          <div className="container flex">
            <input
              type="text"
              placeholder="Search by email or username"
              className="input-bordered input w-full max-w-xs"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              className="btn-primary btn ml-2 border border-none bg-btn"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
        </div>
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
      </div>
    </div>
  );
};

export default SideSearch;
