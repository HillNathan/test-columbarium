import React from 'react';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


export default function MyButton(props) {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: "#1b2c4a",
        }
      },
    });  
  
    return (
        <div className="mybutton-spacer">
            <ThemeProvider theme={theme}>
                <Button variant="contained"
                    color="primary"
                    onClick={props.theOnClick}>
                <span className="lato" >{props.theText}</span>
                </Button>
            </ThemeProvider>
        </div>
    )
}

