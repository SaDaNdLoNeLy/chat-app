const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
});

module.exports = mongoose.model("users", userSchema);
