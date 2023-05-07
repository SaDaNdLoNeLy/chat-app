const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
