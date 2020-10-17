import React from 'react';
import { withRouter, Link } from "react-router-dom";

// importing components from material-ui I used to build the site 
import clsx from 'clsx';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// material-ui icons used to build the site
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import LockIcon from '@material-ui/icons/Lock';


// importing custom components i wrote
import LegendItem from '../../components/LegendItem'
// import PlotMap from '../../components/PlotMap'
import StaticBackground from '../../components/StaticBackground'

const drawerWidth = 240;

// hook to create classes - this is from material-ui website
// this also creates the sliding menu bar effect
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function MainWindow(props) {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#1b2c4a",
      },
      secondary: {
        main: "#546177"
      }
    },
  });  
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <StaticBackground />
      <CssBaseline />
      <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open, 
        }) + " myheader"}
      >
        {/* <Toolbar class="myheader-color"> */}
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <img src="/site-images/StMartinFields_Logo_337.png" className="header-logo"
            alt="St Martin in the Fields logo" />
          <span nowrap="true" className="lato-header">
            Mary Hare Taylor Knight Memorial Columbarium
          </span>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button 
                onClick={()=> props.handleSearchOpen("NAME")}>
              <ListItemIcon><SearchIcon/></ListItemIcon>
              <ListItemText className="secondary">
                <span className="drawer-button">Search by Name</span>
              </ListItemText>
            </ListItem>
              <ListItem button 
                onClick={()=> props.handleSearchOpen("PLOT")}>
              <ListItemIcon><SearchIcon/></ListItemIcon>
              <ListItemText>
                <span className="drawer-button">Search by Plot #</span>
              </ListItemText>
            </ListItem>

        </List>
        <Divider />
        <List>
          {['Available', 'Reserved', 'Occupied', 'On Hold', 
            'Slate-Available', 'Slate-Reserved', 'Slate-Occupied', 
            'Wall', 'Flowers'].map((text, index) => (
            <ListItem key={index}>
              <LegendItem 
                style={text}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <Link to={"/pageone"} label={"Login"}>
            <ListItem button >
              <ListItemIcon><LockIcon/></ListItemIcon>
              <ListItemText className="secondary">
                <span className="drawer-button">Admin Portal</span>
              </ListItemText>
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader + " plot-map"} />

        {/* <PlotMap 
          plotList={props.plotList}
          handleOpen={props.handleOpen}
        /> */}
      </main>
      </ThemeProvider>
    </div>
  );
}

export default withRouter(MainWindow)