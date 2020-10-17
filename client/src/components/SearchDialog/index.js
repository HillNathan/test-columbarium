import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

//==================================================================================================
// Set our transition style and direction for how the dialog box appears
//==================================================================================================
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class SearchDialogSlide extends Component {
    constructor() {
        super();
        
        this.state = {
            open: false,
            searchBy: ""
        }
    }

    //================================================================================================
    // Taking information from props and placing that data into our local state 
    //================================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({ 
            open: incomingProps.showMe,
            searchBy: incomingProps.searchBy })
    }

    //================================================================================================
    // the way that i chose to handle the validation, we are checking to see if the searchTerm is a
    //   number, so by checking if it is NOT a number, then returning the opposite, we are saying that
    //   it is actually a number. I guess I could have just returned the value if isNaN but then the 
    //   validation function - to me - would have functioned backwards. 
    //================================================================================================
    validatePlotSearch = (searchTerm) => {
      return !isNaN(parseInt(searchTerm))
    }

    //================================================================================================
    // We need to have at least one name to seach for, so here we are checking to make sure that at 
    //   least one of the search boxes has information in it. otherwise, we will return false on the
    //   validation.  
    //================================================================================================
    validateNameSearch = (searchObj) => {
      console.log(searchObj)
      if (searchObj.firstName === "" && searchObj.lastName === "") return false
      else return true
    }

    //================================================================================================
    // Since we have multiple search options being handled in one buttone click handler, we will 
    //   look at which way we are searching, validate the search parameter, and then either prompt 
    //   the user to fix their search parameter or execute the search. 
    //================================================================================================
    handleSearchClick = () => {
      if(this.state.searchBy === "PLOT") {
        // put the plot search term into a variable for validation
        var searchTerm = document.getElementById("plot-search-term").value.trim()

        // validate the input
        if (this.validatePlotSearch(searchTerm)) { 
          // we will now check to make sure the number is within the parameters of the database
          if ( parseInt(searchTerm) < 837 && parseInt(searchTerm) > 0) {
            // since we have valid input, we hit the appropriate search function        
            this.props.handlePlotSearch(searchTerm)
          }
          else {
            // error message for a number that is outside the parameters of our database
            this.props.messageBoxOpen({
              header   : "Error...",  
              message  : "You must enter a number between 1 and 836. ",
              referrer : "PLOT"
            })   
          }
          
        }
        else {
          // alert the user that their input needs to be a number
          this.props.messageBoxOpen({
            header   : "Error...",   
            message  : "You must enter a number to search by plot.",
            referrer : "PLOT"
          })
        }
        document.getElementById("plot-search-term").value = null
      }
      else{
        // gather the relevant data into an object to search by name
        var searchObj = {}
        searchObj.firstName = document.getElementById("searchFirstName").value
        searchObj.lastName = document.getElementById("searchLastName").value

        // validate the search object --> mist enter at least one search term
        if (this.validateNameSearch(searchObj)) {
          // since we have at least one term, run function from App.js here to hit the search route
          this.props.handleNameSearch(searchObj)
        }
        else {
          // alert the user that they must enter at least one search term
          this.props.messageBoxOpen({
            header   : "Error...",                                         
            message  : "You must enter at least one name to search for.",  
            referrer : "NAME" 
          })                                             
        }
        
        //clear out the search fields. 
        document.getElementById("searchFirstName").value = null
        document.getElementById("searchLastName").value = null
      }
    }
  
  render() {
  return (
    <div className="dialog-box">
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
        {this.state.searchBy === "PLOT" ? 
          <div>
            <DialogTitle id="alert-dialog-slide-title">Search for a Plot Number</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                    Enter a Plot Number to search for.
              </DialogContentText>
              <TextField
                      autoFocus
                      margin="dense"
                      id="plot-search-term"
                      label="Plot Number"
                      type="text"
                      fullWidth
                    />
            </DialogContent>
          </div>
        :
          <div>
            <DialogTitle id="alert-dialog-slide-title">Search for a Name</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                  Enter a Name to search for.
                  <br />You may enter a first name, last name, or both.
            </DialogContentText>
            <TextField
                    autoFocus
                    margin="dense"
                    id="searchFirstName"
                    label="First Name"
                    type="text"
                    fullWidth
                  />
            <TextField
                    autoFocus
                    margin="dense"
                    id="searchLastName"
                    label="Last Name"
                    type="text"
                    fullWidth
                  />
            </DialogContent>
          </div>
        }
      <DialogActions>
        <Button onClick={() => this.handleSearchClick()} color="primary">
          Search
        </Button>
        <Button onClick={() => this.props.handleClose()} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}}

export default SearchDialogSlide