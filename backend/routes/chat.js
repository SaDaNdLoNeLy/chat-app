const express = require("express");
const checkToken = require("../middleware/auth");
const {accessChat, getChat, createGroup, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chat/chatController")

const router = express.Router();

router.route("/").post(checkToken, accessChat)
router.route("/").get(checkToken, getChat)
router.route("/group").post(checkToken, createGroup)
router.route("/rename").put(checkToken, renameGroup)
router.route("/groupadd").put(checkToken, addToGroup)
router.route("/groupremove").put(checkToken, removeFromGroup)

module.exports = router