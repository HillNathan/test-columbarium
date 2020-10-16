// SET EXPRESS ENVIRONMENT
const express = require("express");
const app = express();

// imports session, http=proxy, logger, and passport to the server
const middleware = require("../middleware");

// Set up our http-proxy
// app.use(middleware.myProxy)

// Set variables for our express environment
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ADD WINSTON LOGGER MIDDLEWARE TO SERVER
app.use(middleware.logger);

// check to see if we are using the production version of the app
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

// We need to use sessions to keep track of our user's login status
app.use(
  middleware.session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(middleware.passport.initialize());
app.use(middleware.passport.session());

// include all of our routes from the routes module to our express environment
require('../routes')(app);

// export our express environment back to the server
module.exports = app;