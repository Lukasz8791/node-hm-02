const express = require("express");
const app = express();
const connectDB = require("./db");

connectDB();

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});
