import React from 'react';
import { withRouter, Link } from "react-router-dom";

// importing components from material-ui I used to build the site 
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

// importing custom components i wrote
import LoginForm from '../../components/LoginForm'
import VariableSpacer from '../../components/VariableSpacer'

// hook to create classes - this is from material-ui website
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function LoginPage(props) {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#1b2c4a",
      }
    }
  })

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
              <img src="/site-images/StMartinFields_Logo_337.png" className="header-logo"
                alt="St Martin in the Fields logo" />
              <span noWrap className="lato-header">
                Mary Hare Taylor Knight Memorial Columbarium -- ADMIN LOG-IN
              </span>
            </Toolbar>
        </AppBar>
        </div>
        <main>
            <Container>
              <LoginForm 
                handleLogin={props.handleLogin}
                openMessageBox={props.openMessageBox}/>
                <VariableSpacer
                  height={250} 
                />
                <Link to={"/"} label={"Plot Map"}>
                  <Button>
                    Back to Plot Map
                  </Button>
                </Link>
            </Container>
        </main>
      </ThemeProvider>
    </div>
  );
}

export default withRouter(LoginPage)