const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");
const joi = require("joi");
const checker = require("express-joi-validation").createValidator({});
const tokenChecker = require("../middleware/auth");

// Input validation
const registerSchema = joi.object({
  username: joi.string().min(6).max(20).required(),
  password: joi.string().min(6).max(20).required(),
  email: joi.string().email().required(),
  dob: joi.date().iso().required(),
});

const loginSchema = joi.object({
  password: joi.string().min(6).max(20).required(),
  email: joi.string().email().required(),
});

//Must pass the validation before continue the route
router.post(
  "/register",
  checker.body(registerSchema),
  authController.controllers.postRegister
);
router.post(
  "/login",
  checker.body(loginSchema),
  authController.controllers.postLogin
);

router.get("/test", tokenChecker, (req, res) => {
  res.send("Pass");
});

module.exports = router;
