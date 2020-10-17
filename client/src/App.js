import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Main from './components/Main'
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


  render() {
    return (
      <Router><Switch>
        <Route exact path="/">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <Main/>
            </header>
            <p className="App-intro">{this.state.data}</p>
          </div> 
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
    )}
}

export default App;