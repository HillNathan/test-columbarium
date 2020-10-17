const db = require('../models')

const API = {
//=====================================================================================================
//  PLOT SEARCH FUNCTIONS
//=====================================================================================================

  //=====================================================================================================
  // this function runs a findAll call to the SQL database and returns all records, using 
  //  the callback function passed to process the information
  //=====================================================================================================
  getAllPlots : cb => {
    db.plots
    .findAll()
    .then(allPlots => {
      cb(allPlots)
    })
  },

  //=====================================================================================================
  // this function runs a FindOne call to the SQL database and returns a single record using
  //  the plot number of the record. the id should be passed in as an integer. Once the record is 
  //  located, the function runs the associated callback function on the record. 
  //=====================================================================================================
  getOnePlot : (plotToFind, cb) => {
    db.plots
    .findOne({ 
      where : { 
        plotNumber : plotToFind
      }
    })
    .then(foundPlot => {
      db.person.findAll({
        where : {
          plotId : foundPlot.plotNumber
        }
      })
      .then(interred => {
        var fullRecord = {}
        fullRecord.plot = foundPlot
        fullRecord.interred = interred
        cb(fullRecord)
      })
    })
  },

  //=====================================================================================================
  // this function updates one plot in the database with the new information sent over in the 
  //   plotInfo object, which should be a full object matching the structure of the database object
  //=====================================================================================================
  updateOnePlot : (plotInfo, cb) => {
    db.plots.update(plotInfo, {
      where: { plotNumber : plotInfo.plotNumber }
    })
    .then(rowsUpdated => {
      // returns a number of rows that were updated, not the actual record. 
      cb(rowsUpdated)
    })
  },

//=====================================================================================================
// PERSON(PEOPLE) FUNCTIONS
//=====================================================================================================

  //=====================================================================================================
  // This function will take in a person as an object, then update the person using the id to odentify the
  //   record to be updated. Error checking for an id key is done at the route level.  
  //=====================================================================================================
  updateOnePerson : (personInfo, cb) => {
    db.person.update(personInfo, {
      where: { id : personInfo.id }
    })
    .then(rowsUpdated => {
      // returns a number of rows that were updated, not the actual record. 
      cb(rowsUpdated)
    })
  },

  //=====================================================================================================
  // this function will create a new person in the people database, using the information sent over  
  // as personInfo. personInfo should be be an object and contain at least the following keys:
  //   "firstName"  - STRING
  //   "lastName"   - STRING
  //   "plotId"     - INTEGER
  // the following keys are optional but not necessary to create the record:
  //   "salutation" - STRING
  //   "middleName" - STRING
  //   "suffix"     - STRING
  // once the record is created is is sent into the callback function, passed in as cb. 
  //=====================================================================================================
  createNewPerson : (personInfo, cb) => {

    db.person.create( personInfo ) 
    .then (newPerson => {
      cb(newPerson)
    })
  },

  //=====================================================================================================
  // this function will run the db query to search by either firstName, lastName, or both. 
  //   namesToLookFor should be an object and contain the following keys: 
  //       "firstName" - STRING
  //        "lastname" - STRING
  // after error-checking in the route, either one or both of these fields will have a value in them
  // but it is possible that one is empty. 
  //=====================================================================================================
  personNameSearch : (searchTerms, cb) => {

    if (searchTerms.firstName === "") {
      db.person.findAll({
        where: { 
          lastName : searchTerms.lastName
        }
      })
      .then(results => {
        cb(results)
      })
    }
    else if (searchTerms.lastName === "") {
      db.person.findAll({
        where: { 
          firstName : searchTerms.firstName
        }
      })
      .then(results => {
        cb(results)
      })
    }
    else {
      db.person.findAll({
        where: { 
          lastName : searchTerms.lastName,
          firstName : searchTerms.firstName
        }
      })
      .then(results => {
        cb(results)
      })

    }
  },

//=====================================================================================================
// USER/ADMIN FUNCTIONS
//=====================================================================================================

  //=====================================================================================================
  // this function searches the user db to see if a user with that username already exists, and if the 
  //  username is unique, it will create that user as a new item in the db and return the user to the 
  //  front-end to be processed. It will also return an error if the username already exists or if there 
  //  is another kind of database error processing the data. data should be sent as follows:
  //   "username"  as a string of minimum 8 characters
  //   "password"  as a string of minimum 8 characters
  //   "firstName" as a string of at least 1 character
  //   "lastName"  as a string of at least 1 character
  //=====================================================================================================
  addUser : (userInfo, cb) => {
    db.user
    .findOne({ where: { username: userInfo.username } })
    .then(response => {
      // do a quick findOne search to see if the username already exists in our users table
      if (response) {
        // if we find a user we get a response -- so we send a response that the username already exists
        cb({ status: "Username already exists." })
      } else {
        // if we don't find a user, then we need to create the user in our database. 
        db.user
          // create a new user in the users table
          .create(userInfo)
          .then(() => {
            // send a response with the new user as a json object and allow the front-end to log the user in 
            //   and then redirect to the appropriate screen. 
            cb(userInfo)
          })
          .catch(err => {
            // if there is an error, return the error
            console.log(err)
            cb(err)
          })
      }
    })
  },

  //=====================================================================================================
  // function to find one user by searching for the user id in the DB and then execute the callback
  //   function on the user object
  //=====================================================================================================
  findUser: (userId, cb) => {
    db.user
    .findOne({ where : { id : userId } })
    .then(response => {
      cb(response)
    })
  },

  allUsers: (cb) => {
    db.user
    .findAll({ 
      attributes: ['username', 'firstName', 'lastName', 'admin', 'id']
    })
    .then(userList => {
      cb(userList)
    })
  },

  //=====================================================================================================
  // This function will take in a user as an object, then update the user using the id to odentify the
  //   record to be updated. Error checking for an id key is done at the route level.  
  //=====================================================================================================
  editUser : (userInfo, cb) => {
    db.user.update (userInfo, 
      {where : {id : userInfo.id }
    })
    .then(rowsUpdated => {
       // returns a number of rows that were updated, not the actual record. 
      cb(rowsUpdated)
    })
  },

  findUserByUsername : (searchTerm, cb) => {
    db.user
    .findOne({ where : { username : searchTerm },
      attributes: ['username', 'firstName', 'lastName', 'admin', 'id']
    })
    .then(response => {
      cb(response)
    })
  },
}

// Export our database functions back to the routes module
module.exports = API;