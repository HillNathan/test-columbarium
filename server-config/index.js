// require("dotenv").config();

// SET EXPRESS ENVIRONMENT
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

require('../routes')(app);

module.exports = app;