const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || process.env.API_PORT;

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat")

const app = express();
app.use(express.json());
app.use(cors());

// Route for authentication
app.use("/api/auth", authRouter);
// Route for user experience
app.use("/api/user", userRouter);
// Route for chat
app.use("/api/chat", chatRouter);
const server = http.createServer(app);

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is listen on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("DB failed");
    console.error(err);
  });
