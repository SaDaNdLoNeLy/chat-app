const express = require("express");
const checkToken = require("../middleware/auth");
const { RtcRole, RtcTokenBuilder } = require("agora-token");
const { nocache } = require("../middleware/nocache");
const router = express.Router();

router.post("/rtctoken", checkToken, nocache, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  // Rtc Examples
  const appId = process.env.AGORA_ID;
  const appCertificate = process.env.AGORA_CERTIFICATE;
  const channelName = req.body.chatId;
  const uid = req.user.userId;
  // const userAccount = "";
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  // console.log("Token With Integer Number Uid: " + token);

  // console.log(
  //   "appID: ",
  //   appId,
  //   "\nappCert: ",
  //   appCertificate,
  //   "\nchatId: ",
  //   channelName,
  //   "\nuid: ",
  //   uid
  // );

  // console.log("\ntoken: ", token);
  res.send({ uid, token });
});
module.exports = router;
