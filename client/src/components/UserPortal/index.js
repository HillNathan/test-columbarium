import React, { Component } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import UserInfo from '../UserInfoDisplay'

class UserPortal extends Component {
    constructor() {
        super();
        
        this.state = {
            userList: [],
        }
    }

    componentWillReceiveProps (incomingProps) {
        this.setState({
            userList: incomingProps.userList
        })
    }

    render() {

        return (
            <div>
                <CssBaseline />
                <h1>Manage Users</h1>
            <hr />
                {this.props.userList.map((userObj, index) => {
                    return (
                        <UserInfo
                            messageBoxOpen={this.props.messageBoxOpen}
                            handleUserClick={this.props.handleUserClick}
                            user={userObj}
                            openEditForm={this.props.openEditForm}
                            index={index} /> )
                })}
            <hr />
            <Button variant="contained" color="primary"                
                onClick={() => this.props.handleUserClick()}>

                <span className="lato">Add a User</span>
            </Button>

            </div>
        )
    }

}

export default UserPortal