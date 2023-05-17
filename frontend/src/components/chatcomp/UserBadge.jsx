import React from "react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <span
      className="m-1 mb-2 cursor-pointer rounded-lg bg-btn px-2 py-1 text-base font-bold"
      onClick={handleFunction}
    >
      {user.username}
      <i className="fa-solid fa-x ml-2"></i>
    </span>
  );
};

export default UserBadge;
