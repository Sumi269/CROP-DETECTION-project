require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const auth = require("./routes/auth");
const chat = require("./routes/chat");
const detect = require("./routes/detect");
const dashboard = require("./routes/dashboard");
const admin = require("./routes/admin");
const weather = require("./routes/weather");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch(err => {
  console.log(err);
});

app.use("/api/auth", auth);
app.use("/api/chat", chat);
app.use("/api/detect", detect);
app.use("/api/dashboard", dashboard);
app.use("/api/admin", admin);
app.use("/api/weather", weather);

app.listen(5000, () => {
  console.log("🚀 Server running on 5000");
});