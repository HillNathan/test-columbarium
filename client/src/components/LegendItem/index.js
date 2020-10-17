import ListItemText from '@material-ui/core/ListItemText';
import React from 'react'
import './style.css'

const makeClass = (theClass) => {
    if(theClass === "on hold") return "on-hold"
    else return theClass
}

export default function LegendItem (props) {
    //==================================================================================================
    // "props" here are just a 'style' which is used to display text and also determine the color of
    //   the component
    //==================================================================================================
    return (
        <div>
            <div className={makeClass(props.style.toLowerCase()) + " legend-box"}>
            </div>
            <div className="legend-text">
                <ListItemText>
                    <span className="lato">{props.style}</span>
                </ListItemText>
            </div>
        </div>
    )
}