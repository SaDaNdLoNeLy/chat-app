const { CallHistory } = require("../../models/callHistory");

const getCallHistory = async (req, res) => {
  try {
    const callHistory = await CallHistory.findOne(
      {
        chat: req.params.chatId,
      },
      "-chat"
    ).populate("calls");

    res.json(callHistory);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong.");
  }
};

module.exports = {
  getCallHistory,
};
