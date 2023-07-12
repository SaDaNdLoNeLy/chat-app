export const getSender = (loggedUser, users) => {
  return users.filter((u) => u._id !== loggedUser.id)[0].username;
};

export const getSenderStatus = (loggedUser, users) => {
  return users.filter((u) => u._id !== loggedUser.id)[0].status;
};
