import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

//==================================================================================================
// Set our transition style and direction for how the dialog box appears
//==================================================================================================
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class UserEdit extends Component {
    constructor() {
        super();
        
        this.state = {
          open: false,
          username: "",
          firstName: "",
          lastName: "",
          admin: false,
          password: "",
          id: 0,
        }

        //==============================================================================================
        // binding change handlers.
        //==============================================================================================
        this.handleChange = this.handleChange.bind(this)
        this.handleSwitch = this.handleSwitch.bind(this)
    }

    //==================================================================================================
    //  Stock handleChange event here...
    //==================================================================================================
    handleChange(event) {
        let { name, value } = event.target;
        this.setState({
          [name]: value
        });
    }

    //==================================================================================================
    //  Special handleChange event here for the Switch component
    //==================================================================================================
    handleSwitch = (event) => {
      this.setState({ [event.target.name]: event.target.checked });
    };

    //================================================================================================
    // Taking information from props and placing that data into our local state 
    //================================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({  
          open: incomingProps.showMe,
          username: incomingProps.theUser.username,
          firstName: incomingProps.theUser.firstName,
          lastName: incomingProps.theUser.lastName,
          admin: incomingProps.theUser.admin,
          id: incomingProps.theUser.id
        })
    }

    //================================================================================================
    // User information will need to be validated before we submit it to the server.
    //================================================================================================
    validateUserEntry = (searchObj) => {
      // for now we will just return true until we actually write this routine
      console.log("Validate searchObj")
      return true   
    }

    //================================================================================================
    // Submit click handling will be done here, first doing a validation on the input and then moving
    //   to actually sending it back to the main processing center to send to the server. 
    //================================================================================================
    handleSaveClick = () => {
      // deconstruct state taking only that values we want to send to the DB
      const userObj = (({firstName, lastName, username, admin, id}) => 
        ({firstName,lastName, username, admin, id}))(this.state)

      // validate the input
      if (this.validateUserEntry(userObj)) { 
          // since we have valid input, we hit the appropriate function to add the user  
          this.props.handleEditUser(userObj)
        }
      else {
        // error message for input that is outside the parameters of our database
        this.props.messageBoxOpen({
          header   : "Error...",  
          message  : "You must submit valid input. ",
          referrer : "EDITUSER"
        })   
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
          <div>
            <DialogTitle id="alert-dialog-slide-title">Edit a user</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                  Edit the information for the user, then click save.
            </DialogContentText>
            <FormGroup>
              <TextField
                autoFocus margin="dense" id="username-edit" name="username"
                label="User Name" type="text" fullWidth value={this.state.username}
                onChange={this.handleChange} />
              <TextField
                margin="dense" id="firstName-edit" name="firstName"
                label="First Name" type="text" fullWidth value={this.state.firstName}   
                onChange={this.handleChange} />
              <TextField
                margin="dense" id="lastName-edit" name="lastName"
                label="Last Name" type="text" fullWidth value={this.state.lastName}         
                onChange={this.handleChange} />
              <FormControlLabel
                control={
                  <Switch value={this.state.admin} 
                    checked={this.state.admin} onChange={this.handleSwitch}
                    name="admin" color="primary"
                /> }
                label="Admin"  />
            </FormGroup>
            </DialogContent>
          </div>
        
      <DialogActions>
        <Button onClick={() => this.handleSaveClick()} color="primary">
          SAVE
        </Button>
        <Button onClick={() => this.props.handleClose("EDIT")} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}}

export default UserEdit