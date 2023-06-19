const jwt = require("jsonwebtoken");

const config = process.env;

const checkToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if(!token) {
    return res.status(403).send("Token is required for authentication.");
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send("Invalid token.")
  }

  return next();
}

// const checkForSearch = (req, res, next) => {
//   let token = req.headers["authorization"];
//   if (!token) {
//     return res.status(403).send("Token is required.")
//   }
//   try {
//     token = token.replace(/^Bearer\s+/, "")
//   }
// }

module.exports = checkToken;