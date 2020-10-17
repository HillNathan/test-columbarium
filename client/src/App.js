import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect
} from "react-router-dom";


import Main from './pages/Main'
import PageOne from './components/PageOne'
import PageTwo from './components/PageTwo'
import logo from './logo.svg';
import './App.css';

//====================================================================================================
// bringing in server-side functions that will allow us to compartmentalize all of our server-side
//  fetching into one module.
const API = require('./functions')

//====================================================================================================
// setting up a object constant that matches the 'activeRecord' key in state to make it easier to 
//   clear it out when we're done displaying it in the Dialog box. 
const emptyInfo = { id: 0, plot: 0, status: "", reservedBy: "", certificate: 0, reservedDate: "",
  numInterred: 0, notes: "", picture: "", interred: [] }

console.log(emptyInfo)

class App extends Component {
  state = {    
    currentPage: "map",   // map, login, or admin
    data: "" ,
    plotMap: [],
    showNamesearchResults: false,        
    nameSearchResultsList: [],
    showPlotDialog: false,
    showNewPersonForm: false,
    showNewUserForm: false,
    showEditUserForm: false,
    showSearchDialog: false,
    searchBy: "",
    
    showMessageDialog: false,
    messageDialogheader: "",
    messageDialogText: "",
    messageDialogReferrer: "",

    showConfirmDialog: false,
    confirmDialogHeader: "",
    confirmDialogText: "",
    actionIfConfirmed: null,

    activeUser: {
      username: "",
      firstName: "",
      lastName: "",
      admin: false,
    },

    userToEdit: {
      username: "",
      firstName: "",
      lastName: "",
      admin: false,
      id: 0,
    },

    isUserAuth: false,

    activeRecord: {
      id: 0,
      plot: 0,
      status: "",
      reservedBy: "",
      certificate: 0,
      reservedDate: "",
      numInterred: 0,
      notes: "",
      picture: "",
      interred: [],
      displayName: "",
    },
    adminActivePage: "PLOT",
    adminActivePlot: 0,
    adminUserList: [],
    selectedFile: null,
  }

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

    //Check to see if there is an authorized user logged into the server
    API.checkUser().then(userObj => {
      // if we do not get a "no user" result from the server, update the current user in state
      if(!userObj.data.result) {
        this.updateAuthStatus(true)
        this.setState({
          activeUser: userObj.data,
        })
      }
    })
    // Fetches our initial plot map array from the server
    this.setPlotMap()
  }
  

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  //====================================================================================================
  // this function sets up the full list of plots into an array of arrays that each have a length  
  //   of 22. I am doing this so that our plotmap component can use a series of array map loops to 
  //   display our plots corerctly on the front-end. 
  //====================================================================================================
  massage = async theArray => {
    // create two empty arrays. One will hold the array of arrays that will eventually make up 
    //  our map, the other will be a temporary container to hold the plots as they are put into
    //  the arrays to make up each row.
    var tempArray = []
    var arrayRow = []

    theArray.forEach(item => {
        // add the item to the row array
        arrayRow.push(item)
        if (item.id % 22 === 0) {
            // if we are at 22 items in that array, then add it to our array of arrays and clear it out
            //  to start the next one. 
            tempArray.push(arrayRow.reverse())
            arrayRow = []
        }
    })
    // return our completed array of arrays
    return tempArray;
  }

  //====================================================================================================
  // This function gets the most up-to-date plot list from the server, formats it into an array of 
  //  arrays so we can display the data like we want to, and then stores that formatted info in state. 
  //====================================================================================================
  setPlotMap = () => {
    // hit the server to fetch our list of all plots in the DB
    API.getAllPlots()
    .then (response => {
        // once we have the data from the server, we need to format it into an array of arrays
        //  so that it can be displayed for our plot map
        this.massage(response.data.tempDB)
        .then ( looseData => {
          // once our data is set up how we need it, se set it into state so that it can be displayed
          this.setState({ plotMap: looseData.reverse()})
        })
    })  
  }


  //====================================================================================================
  // Handling the menu click to go to the admin portal page here; firstly we check to see if there is 
  //   an authorized user. If there is, we allow access to the page. If not we send them to the login 
  //   page instead. 
  //====================================================================================================
  mainMenuClick = () => {
    if (this.state.isUserAuth) this.navigateTo("admin")
    else this.navigateTo("login")
  }

  //==============================================================================================
  // receives a plot ID to be displayed, fetches the plot info from the database, stores
  //   that into in state to be displayed by the plot dialog and sets the variable in 
  //   state to show the appropriate dialog box. 
  // "plotID" should be sent in as an integer value. 
  //==============================================================================================
  handlePlotDialogOpen = plotID => {

    // First, we need to make sure the other Dialog boxes that could potentially send us here are closed
    this.handleSearchDialogClose()
    this.handleNameSearchClose()

    API.getOnePlot( plotID )
    .then(plotData => {
      // once we have the plot information, put the info we need into state and set the display
      // variable for the plot dialog box to be active
      if (plotData.status===200) {
        this.setState({ 
          showPlotDialog: true,
          // pass the received information into the activeRecord part of the state to be displayed. 
          activeRecord: {
            id: plotData.data.data.plot.id,
            plot: plotData.data.data.plot.plotNumber,
            status: plotData.data.data.plot.status,
            reservedBy: plotData.data.data.plot.reservedBy,
            certificate: plotData.data.data.plot.certificate,
            reservedDate: plotData.data.data.plot.reservedDate,
            numInterred: plotData.data.data.plot.numInterred,
            notes: plotData.data.data.plot.notes,
            picture: plotData.data.data.plot.picture,
            interred: plotData.data.data.interred,
          }
        }) 
      }
      else {
        this.setState({
          activeRecord: { name: "There was an error." } 
        })
      }
    })
  }

  handleConfirmDialogClose = () => {
    this.setState({ 
      showConfirmDialog: false,
      })
  }


  //==============================================================================================
  // sets the flag in state to stop showing the dialog box, and clears out the info from state. 
  //==============================================================================================
  handlePlotDialogClose = () => {
    this.setState({ 
      showPlotDialog: false,
      plotDialogInfo: emptyInfo
      })
  }

  //==============================================================================================
  // set flags to open the search dialog box, and pass in how the user would like to search 
  //   the DB
  // "searchBy" is a STRING and should be 'PLOT' or 'NAME'
  //==============================================================================================
  handleSearchDialogOpen = searchBy => {
    // set flags to open the search dialog box, and pass in how the user would like to search the DB
    this.setState({
      showSearchDialog: true,
      searchBy: searchBy
    })
  }

  //==============================================================================================
  // sets the flag in state to stop showing the search box, and clears out the info from state. 
  //==============================================================================================
  handleSearchDialogClose = () => {
    this.setState({ 
      showSearchDialog: false,
      searchBy: "",
      })
    // then we need to empty all the values from the search dialog box for the next time we open it.
  }

  //==============================================================================================
  // process a name search through the server using searchObj and then open the name search 
  //   results dialog box to show our results. 
  // "searchObj" is an object with the following keys:
  //      firstName : STRING
  //      lastName  : STRING
  // one of these keys must have a value - this validation is handled at the data entry point. 
  //==============================================================================================
  handleNameSearch = searchObj => {
    this.setState({ 
      showSearchDialog: false,
      searchBy: "",
      })
      
    // use our functions module to hit the server and search for the information the user submitted
    API.doNameSearch( searchObj )
    .then(response => {
      // open the name search results dialog box and display the information sent back from the DB
      this.setState({
        showNamesearchResults: true,
        nameSearchResultsList: response.data.data
      })
    })
  }

  //==============================================================================================
  // set the flag to close the name search dialog to false and clear the info from state
  //==============================================================================================
  handleNameSearchClose = () => {
    this.setState({
      showNamesearchResults: false,
      nameSearchResultsList: []
    })

  }

  //==============================================================================================
  // referrer is here to be able to re-open a different dialog box once the user closes the 
  //   message box, since wer are closing the other dialog boxes in order to show the message 
  //   box.
  // messageObj should have three keys, corresponding to parts of the message:
  //   header   : STRING   - what should be in the title bar of the dialog box
  //   message  : STRING   - what should be in the body of the dialog box
  //   referrer : STRING   - where this message originated in case we need to re-open another 
  //                              dialog box. Values should be 'PLOT', 'NAME', or 'ADMIN'
  //==============================================================================================
  handleMessageDialogOpen = (messageObj) => {

    // close the other dialog boxes....
    this.handleSearchDialogClose()

    // set the state to display the message box with the appropriate information. 
    this.setState({
      showMessageDialog: true,
      messageDialogHeader: messageObj.header,
      messageDialogText: messageObj.message,
      messageDialogReferrer: messageObj.referrer
    })
  }


  //==============================================================================================
  // Closes the message dialog box, clears out the info from state, and then checks referrer to 
  //   see if we need to re-open another dialog box when this one closes. 
  //==============================================================================================
  handleMessageDialogClose = () => {
    // here is where we check referrer, and open another dialog box if appropriate. 
    if (this.state.messageDialogReferrer !== ""){
      switch (this.state.messageDialogReferrer) {
        case "PLOT" : 
            this.handleSearchDialogOpen("PLOT")
            break
        case "NAME" : 
          this.handleSearchDialogOpen("NAME")
          break
        case "ADMIN" : 
          this.handleShowNewPersonForm()
          break
        case "EDITUSER" : 
          this.handleUserEditFormOpen()
          break
        case "ADDUSER" : 
          this.handleUserEntryFormOpen()
          break
        default :
          // do nothing, no need to open another dialog box
      }
    }
    // close the message dialog box and clear out the information
    this.setState({
        showMessageDialog: false,
        messageDialogheader: "",
        messageDialogText: "",
        messageDialogReferrer: ""
      })
  }

  //==============================================================================================
  //==============================================================================================


  //==============================================================================================
  // Takes in the input of "button" as a STRING and then sets the correct page to display for our 
  //   admin portal or takes the user back to the main page to look at the grid. 
  //==============================================================================================
  handleAdminMenuClick = button => {
    // if the input is "GRID" we will redirect the user to the main page with the plot map
    if (button === "GRID") {
      this.navigateTo("map")
    }
    else {
      // if not "GRID" button will either equal "PLOT" or "USERS" because we control the input to this function.
      this.setState({ adminActivePage: button })
    }
  }

  //==============================================================================================
  // use our functions module to hit the DB and update the current record with the new 
  //   information submitted by our admin user. plotObj is coming from state in a child component
  //   and should be formatted like this: 
  // 
  //==============================================================================================
  handleAdminSaveClick = (plotObj) => {
    // hit the function to update a plot. 
    API.updateOnePlot(plotObj.plot)
    .then (updatedRecord => {
      // then once the plot has been updated, update any information changed in the people interred within
      plotObj.interredArray.forEach(person => {
        if(person.id) API.updateOnePerson(person)
        else API.addPerson(person)
      })
      API.updateOnePlot(plotObj.plot)
      .then(plotData => {
        this.setState({
          activeRecord: {
            id: plotData.data.data.plot.id,
            plot: plotData.data.data.plot.plotNumber,
            status: plotData.data.data.plot.status,
            reservedBy: plotData.data.data.plot.reservedBy,
            certificate: plotData.data.data.plot.certificate,
            reservedDate: plotData.data.data.plot.reservedDate,
            numInterred: plotData.data.data.plot.numInterred,
            notes: plotData.data.data.plot.notes,
            displayName: plotData.data.data.plot.displayName,
            picture: plotData.data.data.plot.picture,
            interred: plotData.data.data.interred,
          }
        })
      })
      this.handleMessageDialogOpen({
        header   : "Sucess",  
        message  : "Your save was successful. ",
        referrer : ""
      }) 
    })
  }

  //==============================================================================================
  // this will handle the search feature of the admin plot editor. "thePlot" should be sent as 
  //   an integer between 1 and 836, error handling is contained within this function. 
  //==============================================================================================
  handleAdminPlotSearch = thePlot => {
    // check to make sure we have an integer, and send an error message if we don't. 
    if ( isNaN(parseInt(thePlot)) ) {
      this.handleMessageDialogOpen({
        header   : "Error...",  
        message  : "You must enter a number in this field. ",
        referrer : ""
      })                                             
    }
    // if we have a number, we need to make sure it is within the parameters of our database
    else if ( parseInt(thePlot) < 723 && parseInt(thePlot) > 0) {
      // once we have an appropriate input value, use our functions to search the database for 
      //  the specific information on the plot, and put that information into state as 
      //  activeRecord.
      
      API.getOnePlot(thePlot)
      .then(plotData => {
        if (!plotData.data.data.plot.clickable && !this.state.activeUser.admin) {
          this.handleMessageDialogOpen({
            header   : "Error...",  
            message  : "You do not have access to edit this area. ",
            referrer : ""
          })                                             
        }
        else {
          this.setState({
            adminActivePlot: thePlot,
            activeRecord: {
              id: plotData.data.data.plot.id,
              plot: plotData.data.data.plot.plotNumber,
              status: plotData.data.data.plot.status,
              reservedBy: plotData.data.data.plot.reservedBy,
              certificate: plotData.data.data.plot.certificate,
              reservedDate: plotData.data.data.plot.reservedDate,
              numInterred: plotData.data.data.plot.numInterred,
              notes: plotData.data.data.plot.notes,
              displayName: plotData.data.data.plot.displayName,
              picture: plotData.data.data.plot.picture,
              interred: plotData.data.data.interred,
            }
          })
        }
      })
    }
    else {
      // error message for a number that is outside the parameters of our database
      this.handleMessageDialogOpen({
        header   : "Error...",  
        message  : "You must enter a number between 1 and 722. ",
        referrer : ""
      })   
    // reset the dialog box to a null value.                                          
    document.getElementById('plot-search-id').value = null }
  }

  //==============================================================================================
  // Set the flag in state to show the box with the form to enter a new person
  //==============================================================================================
  handleShowNewPersonForm = () => {
    this.setState({
        showNewPersonForm : true,
    })
  }

  //==============================================================================================
  // Set the flag in state to show the box with the form to enter a new user
  //==============================================================================================
  handleUserEntryFormOpen = () => {
    this.setState({ showNewUserForm : true })
  }

  //==============================================================================================
  // Set the flag in state to show the box with the form to edit an existing user
  //==============================================================================================
  handleUserEditFormOpen = (userID) => {
    API.getUserbyUsername(userID)
    .then(response => {
      this.setState({
        userToEdit : response.data
      })
    })
    this.setState({ showEditUserForm : true })
  }

  //==============================================================================================
  // Takes in an object and sends that object to the DB to add a user to the list of authorized 
  //   users for the back-end of the web app. Object will have the following key/value pairs:
  //      username  : STRING (must be 8 characters)
  //      password  : STRING (must be 8 characters)
  //      firstName : STRING (cannot be empty)
  //      lastName  : STRING (cannot be empty)
  //==============================================================================================
  handleAddUser = (userObj) => {
    this.handleNewUserClose()
    API.addNewUser(userObj)
    .then(response => {
      console.log(response)
      // pull in the updated list of users, since we have added a user to the list
      API.getUserList().then(userList => {
        this.setState({
          adminUserList: userList.data
        })
      })  
    })
  }

  //==============================================================================================
  // Takes in an object and sends that object to the DB to edit a user on the user list. 
  //      username  : STRING 
  //      admin     : BOOLEAN 
  //      firstName : STRING 
  //      lastName  : STRING 
  //==============================================================================================
  handleEditUser = (userObj) => {
    console.log("===App.js Userobj===")
    console.log(userObj)
    this.handleUserClose("EDIT")
    API.editUser(userObj)
    .then(response => {
      console.log("===handleEditUser response===")
      console.log(response)
      // pull in the updated list of users, since we have edited a user on the list
      API.getUserList().then(userList => {
        this.setState({
          adminUserList: userList.data
        })
      })  
    })
  }

  //==============================================================================================
  // set the flag to close the add user form clear the info from the form. 
  //==============================================================================================
  handleUserClose = (mode) => {
    if(mode ==="ADD") this.setState({ showNewUserForm : false })
    else this.setState({ showEditUserForm : false })
  }

  //==============================================================================================
  // Handles the logging in and authentication of a user. "userObj" should be an object, and 
  //   contain the following keys:
  //      username : STRING
  //      password : STRING
  // If the user enters the correct information, this will redirect the page to the /admin page, 
  //   otherwise it will display an appropriate error message. 
  //==============================================================================================
  handleUserLoginClick = (userObj) => {
    // user our functions module to send the login information to the server
    API.doUserLogin(userObj)
    .then(response => {
      // if the user has entered information incorrectly, display an appropriate error message
      //   - error messaging is generated by the server and will always be in data.message if
      //     there is an error. 
      if (response.data.message) {
        this.handleMessageDialogOpen({
          header: "Login Error",
          message: response.data.message,
          referrer: "LOGIN"
        })
      }
      // user has successfully logged, now we get the user info from the server 
      //   and update it in state
      if (response.data.status === "success") {
        API.checkUser().then(response => {
          this.updateAuthStatus(true)
          this.setState({
            activeUser: response.data,
          })
          // pull in the list of users, since we have an authenticated user to be able to edit them
          API.getUserList().then(userList => {
            this.setState({
              adminUserList: userList.data
            })
          })
          // then we redirect the user to the admin portal of the website. 
          window.location.assign("/admin")
        })
      }
    })
  }

  //==============================================================================================
  // User our functions to log out the user, clear the protected information from state, and 
  //   then redirect the user to the home page. 
  //==============================================================================================
  handleUserLogout = () => {
    this.updateAuthStatus(false)
    this.setState({    
      activeUser: {
        username: "",
        firstName: "",
        lastName: ""
        },
      adminActivePage: "PLOT",
      adminUserList: []
      })
    API.doUserLogout()
    .then(response => {
      console.log("====LOGOUT RESPONSE====")
      console.log(response)
    })
    window.location.assign("/")
  }

  //==============================================================================================
  // compartmentalizing the two places we are updating authentication status, since it resets in 
  //    state when the window redirects we are storing a single variable in localstorage to 
  //    maintain the status across window refreshes. 
  // status should be boolean true or false, even though when it is stored in localstorage it is
  //    stored simply as a string with no type, that is handled wherever we need to pull the 
  //    value from localstorge.
  //==============================================================================================
  updateAuthStatus = status => {
    this.setState({ isUserAuth: status });
    localStorage.setItem("isAuthenticated", status);
  };

  //==============================================================================================
  // this function accepts a multipart form data object including a "image" that is the image file, 
  //  and a "plot" field that gives the plot the picture should be associated with in our db. Then 
  //  we will call our upload function to send the info up to the server. 
  //==============================================================================================
  handleFileUpload = (theData) => {
    // hit the picture upload route with our multipart form data object
    API.pictureFileUpload(theData)
      .then(response => {
        // handle the response
        console.log(response)
        this.handleMessageDialogOpen({
          header   : "Success",
          message  : "Your file has been uploaded successfully!",
          referrer : "OTHER"
        })
        API.getOnePlot(this.state.activeRecord.plot)
        .then(plotData => {
            this.setState({
              activeRecord: {
                id: plotData.data.data.plot.id,
                plot: plotData.data.data.plot.plotNumber,
                status: plotData.data.data.plot.status,
                reservedBy: plotData.data.data.plot.reservedBy,
                certificate: plotData.data.data.plot.certificate,
                reservedDate: plotData.data.data.plot.reservedDate,
                numInterred: plotData.data.data.plot.numInterred,
                notes: plotData.data.data.plot.notes,
                displayName: plotData.data.data.plot.displayName,
                picture: plotData.data.data.plot.picture,
                interred: plotData.data.data.interred,
              }
            })
          })
        })
      .catch(err => {
        console.error("error", err)
      })
    }

  //==============================================================================================
  // This function will automatically set the status of a plot to "ON HOLD" and open up a 
  //   JotForm in a new window with the Plot Number pre-filled. This is so that the manager
  //   of the columbarium can be notified of the request and follow up with the person. 
  //==============================================================================================
  handleReservationClick = (plotNumber) => {
    this.handlePlotDialogClose()
    console.log("=====Reserve this Plot!====")
    var reservedRecord = this.state.activeRecord
    reservedRecord.status = "ON HOLD"
    reservedRecord.plotNumber = reservedRecord.plot
    API.updateOnePlot(reservedRecord)
    .then(response => {
      console.log(response)
      this.setPlotMap()
    })
    var formURL = "https://form.jotform.com/202576481039054?columbariumPlot=" + reservedRecord.plot
    window.open(formURL)
  }

  //==============================================================================================
  //==============================================================================================
  // Here is the begnning of my JSX to render the application 
  //==============================================================================================
  //==============================================================================================
  render() {
    return (
      <div>
        <Router><Switch>
          <Route exact path="/">
                <Main/>
          </Route>

          <Route exact path="/pageone">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <PageOne/>
            </header>
            <p className="App-intro">{this.state.data}</p>
          </div> 
          </Route>
          <Route exact path="/pagetwo">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <PageTwo/>
            </header>
            <p className="App-intro">{this.state.data}</p>
          </div> 
          </Route>
      </Switch></Router>
    </div>
    )}
}

export default App;