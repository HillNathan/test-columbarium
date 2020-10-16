// include any additional middleware declarations up here:
// i.e.
// const API = require("../controller");

module.exports = app => {

    // Starting route to confirm everything is set up to run through express
    app.get('/express_backend', (req, res) => {
        res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
      });

}

