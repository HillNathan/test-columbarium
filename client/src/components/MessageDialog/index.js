import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

//==================================================================================================
// Set our transition style and direction for how the dialog box appears
//==================================================================================================
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class MessageDialog extends Component {
    constructor() {
        super();
        
        this.state = {
            open: false,
            header: "",
            message: ""
        }
    }

    //==============================================================================================
    // Taking information from props and placing that data into our local state 
    //==============================================================================================
    componentWillReceiveProps (incomingProps) {
        this.setState({ 
            open: incomingProps.showMe,
            header: incomingProps.header,
            message: incomingProps.message})
    }
  
  render() {
  return (
    <div className="dialog-box">
      <Dialog
        open={this.state.open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{this.state.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              {this.state.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}}

export default MessageDialog