const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check the uniqueness of the email
    const userExisted = await User.exists({ email: email.toLowerCase() });
    if (userExisted) {
      return res.status(400).send("Email is already used");
    }

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Add user to database
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create JSON Web Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "48h",
      }
    );

    // Send back info
    res.status(201).json({
      userDetailed: {
        email: user.email,
        token: token,
        username: user.username,
      },
    });

  } catch (err) {
    return res.status(500).send("Error! Please try again.");
  }
};

module.exports = postRegister;
