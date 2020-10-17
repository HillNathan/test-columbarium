import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Spacer from '../WideSpacer'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DateInput from '../DateInput'

//==================================================================================================
// Set our transition style and direction for how the dialog box appears
//==================================================================================================
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class NewPersonForm extends Component {
  //==================================================================================================
  // Displays a dialog box allowing the admin user to enter a new person into a plot record
  //==================================================================================================
    constructor() {
        super();
        
        this.state = {
            open: false,
            salutation: "",
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            dateOfBirth: "",
            dateOfDeath: "",
            plotId: 0,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleClickOpen = () => {
        this.setState({ open:true });
    };

    //==================================================================================================
    // When the component receives props from the parent component, we want some of them to be set into 
    //   our local state, so when we get them from the parent we put them into our local state using 
    //   this function. 
    //==================================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({ 
            open: incomingProps.showMe,
            plotId: incomingProps.plot,
        })
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
    // Simple form validation to make sure we have data in the two required fields as per our server. 
    // The required fields are firstName, lastName, and PlotID. Since we are wrnding plotID as part
    //   of our internal processes, the only information required for the admin to enter is the two 
    //   names.
    //==================================================================================================
    formValidation = () => {
      if (this.state.firstName === "" || this.state.lastName === "") {
        // Admin user must enter all required fields to add a person to the plot. Otherwise we will send
        //   an error message letting them know they must fill out all required fields. 
        return false
      }
      else return true
    }

    //==================================================================================================
    // This function will validate the form, and if we have all required fields filled in it will then 
    //   run the handler function to add the new person to the plot, and then clear the local state
    //    so that an additional person can be added if necessary.
    //==================================================================================================
    handleSave() {
      if (this.formValidation()) {

        this.props.handleAddClick(this.state)
        this.setState({
            salutation: "",
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            dateOfBirth: "",
            dateOfDeath: "",
        })
      }
      else {
        this.props.messageBoxOpen({
          header   : "Missing required field(s)",
          message  : "You must fill out all required fields as marked with '*' ",
          referrer : "ADMIN"
        }) 
      }
    }

    render() {
        return(
            <div className="dialog-box">
            <Dialog
              open={this.state.open}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">Add a Person to Plot #{this.state.plot}</DialogTitle>
              <DialogContent>

                <TextField id={"salutation-new"} label="Salutation" name="salutation" 
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.handleChange} fullWidth
                            value={this.state.salutation} /> 
                <Spacer />
                <TextField id={"first-name-new"} label="First Name *" name="firstName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.handleChange} fullWidth
                            value={this.state.firstName} />
                <Spacer />
                <TextField id={"middle-name-new"} label="Middle Name" name="middleName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.handleChange} fullWidth
                            value={this.state.middleName} />
                <Spacer />
                <TextField id={"last-name-new"} label="Last Name *" name="lastName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.handleChange} fullWidth
                            value={this.state.lastName} />
                <Spacer />
                <TextField id={"suffix-new"} label="Suffix" name="suffix" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            onChange={this.handleChange} fullWidth
                            value={this.state.suffix} />
                <Spacer />
                <DateInput
                  id={"dob-new"}
                  label={"Date of Birth"}
                  onChange={this.handleChange}
                  name={"dateOfBirth"}
                  value={this.state.dateOfBirth} />
                <Spacer />
                <DateInput
                  id={"dod-new"} 
                  label={"Date of Death"} 
                  onChange={this.handleChange}
                  name={"dateOfDeath"}
                  value={this.state.dateOfDeath} />
            <Spacer />
            Fields marked with * are required.
            </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleSave()} color="primary">
            Add To Plot
          </Button>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
        )
    }


}

export default NewPersonForm