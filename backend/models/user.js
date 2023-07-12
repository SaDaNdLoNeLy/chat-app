const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  isCalling: { type: Boolean, default: false },
});

module.exports = mongoose.model("users", userSchema);
