const {
  getCallHistory,
} = require("../controllers/callhistory/callhistory.controller");

const router = require("express").Router();

router.get("/:chatId", getCallHistory);

module.exports = router;
