const express = require("express")
const checkToken = require("../middleware/auth")
const {sendMessage, getAllMessage} = require("../controllers/message/messageController")

const router = express.Router()

router.route("/").post(checkToken, sendMessage)
router.route("/:chatId").get(checkToken, getAllMessage)

module.exports = router