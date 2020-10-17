import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Spacer from '../Spacer'

import AdminInterredPerson from '../AdminInterredPerson'
import ConfirmDialog from '../ConfirmDialog';
import NewPersonForm from '../AdminNewPersonForm'
import MyButton from '../MyButton'

//=======================================================================================================
// defining an array for our list of options for the 'status' field on our admin form so that we don't
//   have to worry about mis-matching values in the field, since we are using it for multiple things 
//   throughout the application including some styling. 
//=======================================================================================================
const statusList = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'ON HOLD', 'SLATE-AVAILABLE', 'SLATE-RESERVED', 
'SLATE-OCCUPIED', 'WALL', 'FLOWERS']

class PlotEditor extends Component {
    constructor() {
        super();
        
        this.state = {
            plotNum: 0,
            status: "",
            reservedBy: "",
            certificate: "",
            reservedDate: "",
            numInterred: "",
            notes: "",
            picture: "",
            displayName: "",
            interred: [],
            selectedFile: null,
            guestUser: false,

            showConfirmDialog: false,
            messageConfirmheader: "",
            messageConfirmText: "",

            showNewPersonForm: false,
        }

        //==============================================================================================
        // binding multiple change handlers, since we have multiple ways we need to handle information 
        //   changing in state. 
        //==============================================================================================
        this.handleChange = this.handleChange.bind(this)
        this.handleArrayChange = this.handleArrayChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.onSelectFile = this.onSelectFile.bind(this)
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
    //  Here is a handleChange for information that is being changed within an array in state, so we 
    //    have to handle the information a little differently since it is in an array in state. 
    //==================================================================================================
    handleArrayChange(event) {
        let { name, value, id } = event.target;
        var myIndex = parseInt(id.slice(id.length-1))
        var tempArray = this.state.interred
        tempArray[myIndex][name] = value
        this.setState({
          interred: tempArray
        });
    }

    //==================================================================================================
    //  Here is a handleChange for information that is being changed using a date-picker component 
    //    this is currently not being used, but we could come back to it so I am leaving it here for
    //    the time being until I make a final decision whether or not I am using it. 
    //==================================================================================================
    handleDateChange(newDate, whichDate, index) {
        console.log("PlotEditor handleDateChange...")
        var tempArray = this.state.interred
        tempArray[index][whichDate] = newDate
        this.setState({
            interred: tempArray
          });  
    }

    //==================================================================================================
    //  First of two functions specifically for our picture upload funtionality. This one takes a 
    //    selected picture from the user and places the raw data into state as a file. 
    //==================================================================================================
    onSelectFile = event => {
        event.preventDefault()
        this.setState({
            selectedFile: event.target.files[0],
            picture: event.target.files[0].name
        })
    }

    //==============================================================================================
    // Set the flag in state to start showing the Confirmation Dialog Box
    //==============================================================================================
    handleConfirmDialogOpen = (confirmObj) => {
        this.setState({
          showConfirmDialog: true,
          confirmDialogheader: confirmObj.header,
          confirmDialogText: confirmObj.message,
          actionIfConfirmed: confirmObj.confirmAction
        })
    }
      
    //==============================================================================================
    // Set the flag in state to stop showing the Confirmation Dialog Box
    //==============================================================================================
    handleConfirmDialogClose = () => {
        this.setState({
            showConfirmDialog: false,
            confirmDialogheader: "",
            confirmDialogText: "",
            actionIfConfirmed: null
        })
    }

    //==============================================================================================
    // Set the flag in state to start showing the New Person Form
    //==============================================================================================
    handleAddPersonOpen = () => {
        this.setState({
            showNewPersonForm: true,
        })
    }

    //==============================================================================================
    // Set the flag in state to stop showing the New Person Form
    //==============================================================================================
    closePersonForm = () => {
        this.setState({
            showNewPersonForm: false,
        })
    }

    //==============================================================================================
    // This function closes the new person form, and then updates the interred array in state 
    //   with the new person information. 
    // "newPerson" should be an object and contain the following keys:
    //    salutation - STRING (optional)
    //    firstName - STRING (required)
    //    middleName - STRING (optional)
    //    lastName - STRING (required)
    //    suffix - STRING (optional)
    //    dateOfBirth - DATE (optional)
    //    dateOfDeath - DATE (optional)
    //    plotID - INTEGER (required)
    //  
    // Fields listed as required must contain text, fields listed as optional must be sent but 
    //   can be empty otherwise server will reject the object when it is saved. 
    //==============================================================================================
    addNewPersonToPlot = (newPerson) => {
        // close the new person form
        this.closePersonForm()
        
        // put the new person added to the plot into the interred array within activeRecord, using a 
        //   temporary object since we can't update an array in state directly with a push.   
        var tempObj = this.state.interred
        tempObj.push(newPerson)
        this.setState({
            interred: tempObj
        })
        // clear all of the fields in the form. 
        document.getElementById("salutation-new").value = ""
        document.getElementById("first-name-new").value = ""
        document.getElementById("middle-name-new").value = ""
        document.getElementById("last-name-new").value = ""
        document.getElementById("suffix-new").value = ""
        document.getElementById("dob-new").value = ""
        document.getElementById("dod-new").value = ""
    }

    //==================================================================================================
    // Second of two functions specifically for our picture upload functionality. This one takes the 
    //   file our first function placed in state as well as the plot number and the name of the file
    //   and wraps it all up into a FormData object - which mimics the multi-part data of a form 
    //   submission - and sends it back to App.js to be sent directly to our server to be uploaded.  
    //==================================================================================================
    onUploadClick = () => {
        const theData = new FormData()
        theData.append('image', this.state.selectedFile, this.state.selectedFile.name)
        theData.append('plotNumber', this.state.plotNum)
        theData.append('picture', this.state.picture)
        this.props.handleFileUpload(theData)
    }

    //==================================================================================================
    //  First of two functions specifically for our picture upload funtionality. This one takes a 
    //    selected picture from the user and places the raw data into state as a file. 
    //==================================================================================================
    onchangeFileClick = () => {
        this.handleConfirmDialogOpen({
            header          : "CONFIRMATION",
            message         : "Please confirm that you would like to replace the picture currently on file.",
            confirmAction   : this.onUploadClick
        })
    }

    //==============================================================================================
    // Taking information from props and placing that data into our local state 
    //==============================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({ 
            plotNum: incomingProps.plot,
            status: incomingProps.data.status,
            reservedBy: incomingProps.data.reservedBy,
            certificate: incomingProps.data.certificate,
            reservedDate: incomingProps.data.reservedDate,
            numInterred: incomingProps.data.numInterred,
            notes: incomingProps.data.notes,
            picture: incomingProps.data.picture,
            interred: incomingProps.data.interred,
        })
        if (incomingProps.currentUsername === 'guestacct') this.setState({ guestUser: true})
        if (incomingProps.data.displayName === null) this.setState({ displayName: "" })
        else this.setState({ displayName: incomingProps.data.displayName })
    }

    //==================================================================================================
    //  This funtion grabe a whole bunch of information from state and puts it into a format that is 
    //    needed by the App.js function to send the information back to the server. 
    //==================================================================================================
    getFormInfo = () => {
        var plotData = {}
        plotData.plot = {}
        plotData.plot.status = this.state.status
        plotData.plot.plotNumber = this.state.plotNum
        plotData.plot.certificate = this.state.certificate
        plotData.plot.reservedBy = this.state.reservedBy
        plotData.plot.reservedDate = this.state.reservedDate
        plotData.plot.numInterred = this.state.numInterred
        plotData.plot.notes = this.state.notes
        plotData.plot.picture = this.state.picture
        plotData.plot.displayName = this.state.displayName.toUpperCase()
        plotData.interredArray = this.state.interred
        plotData.newPerson = this.state.newPerson
        console.log(plotData)
        return plotData
    }

    render() {

        return (
            <div>
                <CssBaseline />
               {(this.state.plotNum === 0) ? (
                   <h2><span className="lato">Please enter a plot number between 1 and 722</span></h2>
               ) : (
                <Container maxWidth="xl" >
                    <Grid container spacing={1} justify="flex-start">
                        <Grid item xl={10} lg={10} md={10} sm={10} xs={10} >
                            <h2>Plot information for Plot #{this.state.plotNum}</h2>
                        </Grid>
                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2} >
                            {(this.state.guestUser) ? 
                                <MyButton 
                                    theText={"Save Changes"} />
                            :
                                <MyButton 
                                    theOnClick={()=> this.props.handleSaveData(this.getFormInfo())}
                                    theText={"Save Changes"} />
                            }
                        </Grid>
                        <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                            {(this.state.guestUser) ? 
                                <TextField id="plot-status" name="status" label="Plot status" disabled
                                    variant="outlined" value={this.state.status} fullWidth={true} >
                                </TextField>
                            :
                                <TextField id="plot-status" name="status"  label="Plot status"
                                    variant="outlined" value={this.state.status} select
                                    onChange={this.handleChange} fullWidth={true} >
                                    {statusList.map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                        {option}
                                        </MenuItem> ))}
                                </TextField>
                            }
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                            {(this.state.guestUser) ? 
                                <TextField id="display-name" name="displayName" label="Name to Display" 
                                variant="outlined" disabled fullWidth={true} /> 
                            :
                                <TextField id="display-name" name="displayName" label="Name to Display" 
                                    variant="outlined" value={this.state.displayName} fullWidth={true}
                                    onChange={this.handleChange} />
                            }
                        </Grid>
                        <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                            {(this.state.guestUser) ? 
                                <TextField id="certificate" name="certificate" label="Certificate #" 
                                    variant="outlined" value={this.state.certificate} disabled fullWidth={true}/>
                            :
                                <TextField id="certificate" name="certificate" label="Certificate #" 
                                    variant="outlined" value={this.state.certificate} fullWidth={true} 
                                    onChange={this.handleChange}/>
                            }
                        </Grid>
                        <Grid item xl={1} lg={1} md={1} sm={1} sx={1}>
                            {(this.state.guestUser) ? 
                                <TextField id="num-interred" name="numInterred" label="How Many Interred" 
                                    variant="outlined" value={this.state.numInterred} disabled fullWidth={true}/>
                            :
                                <TextField id="num-interred" name="numInterred" label="How Many Interred" 
                                    variant="outlined" value={this.state.numInterred} fullWidth={true}                       
                                    onChange={this.handleChange} />
                            } 
                        </Grid>
                        <Grid item lg={2}>
                            {(this.state.guestUser) ? 
                                <TextField id="reserved-date" name="reservedDate" label="Date of Reservation" 
                                variant="outlined" value={this.state.reservedDate} disabled fullWidth={true}/>
                            :
                                <TextField id="reserved-date" name="reservedDate" label="Date of Reservation" 
                                    variant="outlined" value={this.state.reservedDate} fullWidth={true}
                                    onChange={this.handleChange} />
                            }
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={4} sx={4} >
                            {(this.state.guestUser) ? 
                                <TextField id="reserved-by" name="reservedBy" label="Reserved By" fullWidth={true}
                                    variant="outlined" value={this.state.reservedBy} disabled />
                            :
                                <TextField id="reserved-by" name="reservedBy" label="Reserved By" fullWidth={true}
                                    variant="outlined" value={this.state.reservedBy}                                         
                                    onChange={this.handleChange} />
                            }                                  
                        </Grid>
                        {/* ternery operators here to change what we show based on whether we have a picture in 
                        the file or not */}
                        {/* {(this.state.picture === "") ?  */}
                            <Grid item xl={4} lg={4} md={4} sm={4} sx={4}>
                                <TextField id="picture" name="picture" fullWidth={true}
                                    variant="outlined" value={this.state.picture}                                   
                                    onChange={this.handleChange}/>
                            </Grid>
                        {/* :
                            <Grid item xl={4} lg={4} md={4} sm={4} sx={4} >
                                <TextField id="picture" name="picture" fullWidth={true}
                                    value={this.state.picture}
                                    variant="outlined" disabled />
                            </Grid>
                        }
                            {/* <Grid item xl={2} lg={2} md={2} sm={2} xs={2} >
                                {(this.state.guestUser) ? 
                                    <MyButton 
                                        theText={"Upload File"} />    
                                :
                                    <MyButton 
                                        theOnClick={() => this.onchangeFileClick()} 
                                        theText={"Upload File"} />    
                                }
                            </Grid> */}
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                            {(this.state.guestUser) ? 
                                <TextField id="notes" name="notes" label="Notes" 
                                variant="outlined" fullWidth={true} multiline rows={4} disabled/>
                            :
                                <TextField id="notes" name="notes" label="Notes" value={this.state.notes} 
                                    variant="outlined" fullWidth={true} multiline rows={4} 
                                    onChange={this.handleChange} />
                            }
                        </Grid>
                    </Grid>
                    <Divider />
                    <Spacer height={20} />
                    {this.state.interred.map((person, index) => {
                        return (<AdminInterredPerson key={index}
                            guestUser={this.state.guestUser}
                            person={person}
                            index={index}
                            handleChange={this.handleArrayChange}
                            handleDateChange={this.handleDateChange}
                        /> )
                    })}       
                    <Divider />
                    <Grid>
                        {(this.state.interred.length < 3) ? 
                            (this.state.guestUser) ? 
                                <MyButton color="primary" variant="contained"
                                    theText={"Add a Person"} />  
                            :
                                <MyButton color="primary" variant="contained"
                                    theOnClick={() => this.props.handleShowNewPersonForm()}
                                    theText={"Add a Person"} />   
                        :
                        <div></div> }
                    </Grid>   
                </Container>
               )}
                <NewPersonForm 
                    showMe={this.state.showNewPersonForm}
                    handleAddClick={this.addNewPersonToPlot}
                    handleClose={this.closePersonForm}
                    plot={this.state.plotNum}
                    messageBoxOpen={this.props.messageBoxOpen} />  
                <ConfirmDialog
                    showMe={this.state.showConfirmDialog}
                    handleClose={this.handleConfirmDialogClose}
                    header={this.state.confirmDialogHeader}
                    message={this.state.confirmDialogText}
                    actionIfConfirmed={this.state.actionIfConfirmed} />
            </div>
    )}
}

export default PlotEditor