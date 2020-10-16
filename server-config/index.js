// require("dotenv").config();

// SET EXPRESS ENVIRONMENT
const express = require("express");
const app = express();

// imports session, http=proxy, logger, and passport to the server
const middleware = require("../middleware");

// Set variables for our express environment
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ADD WINSTON LOGGER MIDDLEWARE TO SERVER
app.use(middleware.logger);

// check to see if we are using the production version of the app
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

require('../routes')(app);

module.exports = app;