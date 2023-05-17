import { Avatar } from "@mui/material";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      className="container my-4 mb-1 flex w-full cursor-pointer items-center rounded-lg bg-primary px-2 py-1 hover:bg-slate-600"
      onClick={handleFunction}
    >
      <div className="placeholder avatar">
        <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
          <span className="text-3xl">{user.username[0]}</span>
        </div>
      </div>
      <div className="ml-4 text-lg">
        {user.username}
        <div className="font-bold text-sm">Email: {user.email}</div>
        
      </div>
    </div>
  );
};

export default UserListItem;
