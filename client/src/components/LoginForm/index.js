import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Spacer from '../Spacer'
import Button from '@material-ui/core/Button';

class LoginForm extends Component {
//======================================================================================================
//  Form with a username and password field, and the associated logic to capture the info and send it
//    back to App.js to be sent to the server. 
//======================================================================================================

    constructor() {
        super();
        
        this.state = {
            username: "",
            password: "",
        }

        this.handleChange = this.handleChange.bind(this)
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
    //  Wrapping an event.preventDefault around the sending of the username and password to the login
    //    back to App.js so that we don't prematurely reload the page. 
    //==================================================================================================
    getFormInfo = (event) => {
        event.preventDefault()
        return this.state
    }

    //==================================================================================================
    //  Wrapping all of our validation, preventDefault, and login submission into this one function so
    //    that all of it can be in one spot. 
    //==================================================================================================
    handleLoginClick = (event) => {
        event.preventDefault()
        if (this.state.username === ""){
            this.props.openMessageBox({
                header   : "Login Error...",
                message  : "You must enter a user name to log in.",
                referrer : "LOGIN"
            })
        }
        else if (this.state.password === ""){
            this.props.openMessageBox({
                header   : "Login Error...",
                message  : "You must enter a password to log in.",
                referrer : "LOGIN"
            })
        }
        else {
            this.props.handleLogin(this.state)
        }
    }

    render() {

        return (
            <div>
                <CssBaseline />
                <h2>Please Log in to continue:</h2>
                <Spacer />
                <Grid container spacing={1} justify="flex-start">
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <TextField id="username" name="username"  label="Username"
                            variant="outlined" value={this.state.username} 
                            onChange={this.handleChange} fullWidth={true} >
                        </TextField>
                    </Grid>
                    <Spacer />
                    <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                        <TextField id="password" name="password"  label="Password"
                            variant="outlined" value={this.state.password} type="password"
                            onChange={this.handleChange} fullWidth={true} >
                        </TextField>
                    </Grid>
                    <Spacer />
                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2} >
                        <Button color="primary"
                            onClick={ event => this.handleLoginClick(event)}
                        >
                            Login
                        </Button>    
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default LoginForm
