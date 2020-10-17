const app = require('./server-config')
const port = process.env.PORT || 5000;
const db = require("./models");

// Set options to not clear the db upon setup
const syncOptions = { force: false };

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions)
    .then( () => {
        app.listen(port, () => console.log(`Listening on port ${port}`));
    })