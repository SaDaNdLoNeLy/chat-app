export const getSender = (loggedUser, users) => {
  return users.filter((u) => u._id !== loggedUser.id)[0].username;
};
