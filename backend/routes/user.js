const express = require("express");
const tokenChecker = require("../middleware/auth");
const { allUser } = require("../controllers/user/userController");

const router = express.Router();

// Search users
router.route("/").get(tokenChecker, allUser);

module.exports = router;
