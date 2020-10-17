// declaring our middleware packages here. 
const middleware = require("../middleware")
const passport = middleware.passport
const formidable = require('formidable')

// bring in my database controller here
const API = require("../controller");

// declare my routes and send them back to the server-config module
module.exports = app => {

  // Starting route to confirm everything is set up to run through express
  app.get('/express_backend', (req, res) => {
      res.send({ express: 'Added main component (without plotmap) as well as some support components...' });
    });

//=====================================================================================================
// PLOT ROUTES
//=====================================================================================================

  //=====================================================================================================
  // GET route that simply returns the entire contents of the plot database to the front-end for 
  //   processing as an array of JSON objects.  
  //=====================================================================================================
  app.get('/api/plots/getall', (req,res) => {
    API.getAllPlots(theData => {
      res.send({tempDB : theData })
    })
  })

  //=====================================================================================================
  // POST route to get info for one plot from our SQL database
  //  plot number should be sent in req.body as "id" and should be an integer
  //=====================================================================================================
  app.post('/api/plots/getone', (req,res) => {
    API.getOnePlot(req.body.id, thePlot => {
      res.send({ data : thePlot })
    })
  })

  //=====================================================================================================
  // POST route to save new information about a plot into the database. plot info should be sent in req.body
  // and must include a plot number. 
  //=====================================================================================================
  app.post('/api/plots/update', (req,res) => {
    API.updateOnePlot(req.body, response => {
      if (response.length === 1) {
        API.getOnePlot(req.body.plotNumber, thePlot => {
          res.send({ data : thePlot })
        })
      }
      else res.send({ status: "fail" })
    })
  })

  //=====================================================================================================
  // POST route to take in a picture, save it to the server in our public folder so it is accessible by the 
  //   front-end, and add the picture information to the plot record so that when the plot is pulled up, 
  //   the picture can be displayed. 
  // Receives multipart form data with a picture file and a "plot" field giving the plot number for the 
  //   database association. 
  //=====================================================================================================
  app.post('/api/plots/picture/upload', (req,res) => {
    var myObj = {}

    var form = new formidable.IncomingForm()
    form.uploadDir = __dirname + '/../client/public/images/';
    
    form.on('field', (name, field) => {
      console.log(`-=- FIELD ${name} FOUND -=-`);
      myObj[name] = field
    })
    form.on('fileBegin', (name, file) => {  
      console.log(`-=- FILE ${file.name} FOUND -=-`);
      file.path = form.uploadDir + file.name;
    })
    .on('error', (err) => {
      console.error('Error', err)
      res.send("Error")
      throw err
    })
    .on('end', () => {
      API.updateOnePlot(myObj, response => {
        console.log(response)
      })
      res.send("File uploaded Successfully")
    })

    doParse(form,req)
    //====================================================================================================
    // leaving this commented out for now, since we are not doing picture uploads during this particular
    //     build of the app. 
    //====================================================================================================
    // .then(response => {
    //   console.log("Form was parsed")
    //       try {
    //         bucket.upload(picturePath)
    //         console.log("File sent to Firebase")
    //       }
    //       catch(err) {
    //         console.log("E=E=E=E=E there was an error. E=E=E=E=E")
    //         console.log(err)
    //       }
    // })

  })

//=====================================================================================================
// Name or Person Routes
//=====================================================================================================

  //=====================================================================================================
  // POST route to search the sql databse for any reserved_by that include a string of letters, ideally a name.
  // Search term should be sent in req.body as "name" and should be a String
  //=====================================================================================================
  app.post('/api/searchbyname', (req,res) => {
    API.searchByName(req.body.name, response => {
      res.send({ data: response })
    })
  })

  //=====================================================================================================
  // POST route to search the SQL database for a person using their first, last, or first & last name. 
  //  we will require that all fields be sent in, but fields not being used can be left empty. Fields in 
  //  req.body must be as follows, and at least one of them must contain text:
  //      firstName = String
  //      lastName = String
  // response will be sent as an array, so even if there is only one response it will be in an array since 
  //  there COULD be multiple responses to the query. Empty objects in req.body will get an error response. 
  //=====================================================================================================
  app.post('/api/people/namesearch', (req,res) => {
    if (req.body.firstName === "" && req.bodyLastName === "") {
      res.send({ data: [{error: "No search terms were sent"}]})
    }
    else {
      API.personNameSearch(req.body, response => {
        res.send({ data: response })
      })
      }
  })

  //=====================================================================================================
  // POST route to create a new person in the SQL database record in the people table, and make sure that person
  //  is associated with a plot where they are interred. Person should be in req.body and should be sent as follows:
  //    salutation - STRING (optional)
  //    firstName - STRING (required)
  //    middleName - STRING (optional)
  //    lastName - STRING (required)
  //    suffix - STRING (optional)
  //    dateOfBirth - DATE (optional)
  //    dateOfDeath - DATE (optional)
  //    plotID - INTEGER (required)
  //  
  // Fields listed as required must contain text, fields listed as optional must be sent but can be empty. 
  //=====================================================================================================
  app.post('/api/people/create', (req,res) => {
    API.createNewPerson(req.body, response => {
      res.send({ data: response })
    })
  })

  //=====================================================================================================
  // POST route to update one person in the SQL database in the person table. Person should be in req.body and 
  //  contain at minimum the id for the person being updated as an integer. 
  //=====================================================================================================
  app.post('/api/people/update', (req,res) => {
    if (!req.body.id) {
      res.send({ data: [{error: "No person id was sent"}]})
    }
    else {
      API.updateOnePerson(req.body, response => {
        res.send({ data : response })
      })  
    }
  })

//=====================================================================================================
// USER ROUTES for db management
//=====================================================================================================

  //=====================================================================================================
  // POST route to create a user in the users database. information should be sent in req.body
  // and include the following information: 
  //   "username" as a string of minimum 8 characters
  //   "password" as a string of minimum 8 characters
  //   "firstName" as a string of at least 1 character
  //   "lastName" as a string of at least 1 character
  //=====================================================================================================
  app.post("/api/users/add", (req, res) => {
    API.addUser(req.body, response => {
      res.send(response)
    })
  })

  //=====================================================================================================
  // LOGIN ROUTE - uses our passport middleware to determine if  our user has appropriate access
  //  this should accept the user information in an object "user" and have the following key-value pairs:
  //    "username" as a string
  //    "password" as a string
  // 
  //  if the login is successful, {status:"success"} will be sent to the front end and the app can be 
  //  redirected to the protected route, since isAuthenticated will return a true value. 
  //=====================================================================================================
  app.post("/api/users/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(info)
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err)
        }
        return res.status(200).json({ status: "success" })
      })
    })(req, res, next)
  })

  //=====================================================================================================    
  // This route checks to see if there is an active user (represented in the req as req.user, which is 
  //   simply the id of the user) and then finds that user in the db and sends it back to the client as
  //   a JSON object. 
  //=====================================================================================================    
  app.get('/api/users/checkuser', (req,res) => {
    if (!req.user) return res.json({ result: "no user" })
    else {
      API.findUser(req.user, userObj => {
        res.json({
          username: userObj.username,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          admin: userObj.admin,
        })
      })
    }
  })

  //=====================================================================================================    
  // Route for pulling a list of users to be used by the administrator to manage the user access to the 
  //   adminstrative portal side of the app. This returns only the username, firstname, and lastname so
  //   that security can be maintained. The route also checks to make sure that there is someone logged 
  //   in before returning any data. 
  //=====================================================================================================
  app.get('/api/users/userlist', (req,res) => {
    if (!req.user) return res.json({ result: "not authorized" })
    else {
      API.allUsers(userList => {
        res.json(userList)
        })
    }
  })

  //=====================================================================================================
  // route to allow the admin users to update a user in the DB. This route checks to make sure we have 
  //   A user logged in first - the check to make sure we have an admin user logged in is done on the 
  //   front end, as only admin users even have access to see the form this is coming from.     
  //=====================================================================================================    
  app.post('/api/users/edit', (req,res) => {
    if (!req.user) return res.json({ result: "not authorized" })
    else {
      API.editUser(req.body, response => {
        res.json(response)
      })
    }
  })

  //=====================================================================================================
  // route to allow the admin users to find a user by username. This is used when we are picking a 
  //   specefic user to edit using the admin user portal.      
  //=====================================================================================================    
  app.post('/api/users/find/username', (req, res) => {
    if (!req.user) return res.json({ result: "not authorized" })
    else {
      API.findUserByUsername(req.body.username, response => { 
        res.json(response)
      })
    }
  })

  //=====================================================================================================    
  // Route for logging user out
  //=====================================================================================================
  app.get('/api/users/logout', (req, res) => {
    // use passport to log the user out of their session
    req.logout()
    // redirect the browse to the home route with no user object
    res.status(200).json({ status: "success" }) 
  })

}



