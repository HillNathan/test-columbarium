import React from 'react';
import { withRouter, Link } from "react-router-dom";

// importing components from material-ui I used to build the site 
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// importing icons for our app to use
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import EditIcon from '@material-ui/icons/Edit';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import SearchIcon from '@material-ui/icons/Search';

// importing custom components i wrote
import PlotEditor from '../../components/PlotEditor';
import UserPortal from '../../components/UserPortal'

import './style.css'

const drawerWidth = 240;

// hook to create classes - this is from material-ui website
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function AdminPage(props) {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#1b2c4a",
      }
    }
  })

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img src="/site-images/StMartinFields_Logo_337.png" className="header-logo"
            alt="St Martin in the Fields logo" />
          <span noWrap className="lato-header">
            Mary Hare Taylor Knight Memorial Columbarium -- ADMIN PORTAL
          </span>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
            <div className="drawer-header">
                <Typography variant="h5" noWrap>
                <span className="drawer-label">Menu</span>
                </Typography>
            </div>
            <Divider />
        <List>
          <ListItem button onClick={() => props.handleMenuClick("PLOT")}>
            <ListItemIcon><EditIcon/></ListItemIcon>
            <ListItemText>
            <span className="drawer-button">Edit a Plot</span>
            </ListItemText>
          </ListItem>
        <Divider />
        {/* We only want to show the "manage users" menu option to admin users, I am using a 
          ternery operator to figure out whether to show it or not.  */}
        {(props.adminUser) ? 
          <div>
            <ListItem button onClick={()=>props.handleMenuClick("USERS")}>
              <ListItemIcon><PersonAddOutlinedIcon /></ListItemIcon>
              <ListItemText>
              <span className="drawer-button">Manage Users</span>
              </ListItemText>
            </ListItem>
          <Divider />
        </div>
        :
          <div></div>
        }
        <Link to={"/"} label={"Home"}>
          <ListItem button>
              <ListItemIcon><ViewComfyIcon/></ListItemIcon>
              <ListItemText>
                <span className="drawer-button">Back to Plot Map</span>
              </ListItemText>
          </ListItem>
        </Link>
        <Divider />
          <ListItem button onClick={()=>props.handleUserLogout()}>
              <ListItemIcon><MeetingRoomIcon/></ListItemIcon>
              <ListItemText>
              <span className="drawer-button">Log Out</span>
              </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      {(props.activePage === "PLOT") ? 
        <main className={classes.content + " plot-map"}>
          <div className={classes.toolbar} />
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <SearchIcon />
            </Grid>
            <Grid item>
              <TextField id="plot-search-id" label="plot #" />
            </Grid>
            <Grid item>
            <Button variant="contained" color="primary"
              onClick={() => props.handleAdminSearch(parseInt(document.getElementById('plot-search-id').value))}>
              <span className="lato">Go!</span>
            </Button>
            </Grid>
          </Grid>
          <hr />
            <PlotEditor
              currentUsername={props.currentUsername}
              plot={props.plot}
              handleSaveData={props.handleSaveData}
              data={props.plotData}
              handleShowNewPersonForm={props.handleShowNewPersonForm}
              handleFileUpload={props.handleFileUpload}
              messageBoxOpen={props.messageBoxOpen}
              confirmDialogOpen={props.confirmDialogOpen} />
        </main>
      :
        <main className={classes.content + " plot-map"}>
          <div className={classes.toolbar} />
          <UserPortal 
            messageBoxOpen={props.messageBoxOpen}
            userList={props.userList}
            handleUserClick={props.handleUserClick} 
            openEditForm={props.openEditForm} />
        </main>
      }
    </ThemeProvider>
    </div>
  );
}

export default withRouter(AdminPage)
