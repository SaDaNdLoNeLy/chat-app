const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Send JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: email
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "48h"
        }
      );

      return res.status(200).json({
        userDetailed: {
          email: user.email,
          token: token,
          username: user.username,
        },
      });
    }

    return res.status(400).send("Invalid login info. Please try again");
  } catch (err) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postLogin;
