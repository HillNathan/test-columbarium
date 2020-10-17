import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Spacer from '../Spacer'

//======================================================================================================
// Technically speaking this doesn't have to be a fully stateful component, but I had wanted to 
//   use a date-picker component here, and may come back to do it at a later point, so for now 
//   I will leave it as a stateful component in case I want to come back later and add the date
//   picker component. 
//======================================================================================================

class InterredPerson extends Component {
//======================================================================================================
// Displays an editable list of fields that is used to manage persons interred within a specific plot
//======================================================================================================
    
    //==================================================================================================
    // this funtion isn't used right now, but it will be if I come back to add a date picker component
    //   so I'm leaving it here in case I need it at a later point in time. 
    //==================================================================================================
    handleDateChange = (event, key, theIndex) => {
        this.props.handleDateChange(event, key, theIndex)
        this.setState({
            startDate : event
        })
      };

    render() {
        return (
            <Grid container spacing={1} justify="flex-start">
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    {(this.props.guestUser) ? 
                        <TextField id={"salutation" + this.props.index} label="Salutation" name="salutation" 
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            disabled value={this.props.person.salutation} />
                    :
                        <TextField id={"salutation" + this.props.index} label="Salutation" name="salutation" 
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.props.handleChange}
                            value={this.props.person.salutation} />
                    }   
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    {(this.props.guestUser) ? 
                        <TextField id={"first-name-" + this.props.index} label="First Name" name="firstName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            disabled value={this.props.person.firstName} />
                    :
                        <TextField id={"first-name-" + this.props.index} label="First Name" name="firstName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.props.handleChange}
                            value={this.props.person.firstName} />
                    }
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    {(this.props.guestUser) ? 
                        <TextField id={"middle-name-" + this.props.index} label="Middle Name" name="middleName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            disabled value={this.props.person.middleName} />   
                    :                 
                        <TextField id={"middle-name-" + this.props.index} label="Middle Name" name="middleName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.props.handleChange}
                            value={this.props.person.middleName} />
                    }
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    {(this.props.guestUser) ? 
                        <TextField id={"last-name-" + this.props.index} label="Last Name" name="lastName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            disabled value={this.props.person.lastName} />
                    :
                        <TextField id={"last-name-" + this.props.index} label="Last Name" name="lastName"
                            InputLabelprops={{ shrink: true, }} variant="outlined" 
                            onChange={this.props.handleChange}
                            value={this.props.person.lastName} />
                    }
                </Grid>
                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    {(this.props.guestUser) ? 
                        <TextField id={"suffix-" + this.props.index} label="Suffix" name="suffix" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            disabled value={this.props.person.suffix} />
                    :
                        <TextField id={"suffix-" + this.props.index} label="Suffix" name="suffix" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            onChange={this.props.handleChange}
                            value={this.props.person.suffix} />
                    }
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    {(this.props.guestUser) ? 
                        <TextField id={"dob-" + this.props.index} label="Date of Birth" name="dateOfBirth" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            disabled value={this.props.person.dateOfBirth} />
                    :
                        <TextField id={"dob-" + this.props.index} label="Date of Birth" name="dateOfBirth" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            onChange={this.props.handleChange} 
                            value={this.props.person.dateOfBirth} />
                    }
                </Grid>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    {(this.props.guestUser) ? 

                        <TextField id={"dod-" + this.props.index} label="Date of Death" name="dateOfDeath" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            disabled value={this.props.person.dateOfDeath} />
                    :
                        <TextField id={"dod-" + this.props.index} label="Date of Death" name="dateOfDeath" 
                            InputLabelprops={{ shrink: true, }} variant="outlined"
                            onChange={this.props.handleChange}
                            value={this.props.person.dateOfDeath} />
                    }
                </Grid>
                <Spacer />
            </Grid>
        )
    }
}

export default InterredPerson