import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import './style.css'

//==================================================================================================
// Set our transition style and direction for how the dialog box appears
//==================================================================================================
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

class NameSearchResults extends Component {
    constructor() {
        super()
        
        this.state = {
            open: false,
            results: []
        }
    }

    //==============================================================================================
    // Taking information from props and placing that data into our local state 
    //==============================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({ 
            open: incomingProps.showMe,
            results: incomingProps.results })
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
            <DialogTitle id="alert-dialog-slide-title">Search Results</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    There were {this.state.results.length} results to your search. 
                </DialogContentText>
            <Divider />
            <DialogContentText>
            {this.state.results.length === 0 ? 
                <span>sorry...</span>
            :
                <ul>
                
                {this.state.results.map(item => {
                    // running a map function here to return a list item displaying the appropriate info from 
                    //   each item in the results array, which is an array of objects. 
                    return (
                        <div onClick={() => this.props.searchResultClick(item.plotId)} className="link-lookalike">           
                            <li>Plot #{item.plotId} - {item.salutation} {item.firstName} {item.middleName} {item.lastName} {item.suffix}</li>
 
                        </div>            
                    )}
                )}
                </ul>
            }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.props.handleClose()} color="primary">
                    Close
                </Button>
            </DialogActions>
            </Dialog>
    </div>
  )}
}

export default NameSearchResults