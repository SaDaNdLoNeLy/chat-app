const User = require("../../models/user");

//  /api/user?search
const allUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user.userId } });
  res.send(users);
};

module.exports = { allUser };
