import React from 'react'

// a variable spacer component
export default function VariableSpacer (props) {
    var theHeight, theWidth
    if (props.height === undefined) theHeight = 20
    else theHeight = props.height

    if (props.width === undefined) theWidth = 20
    else theWidth = props.width

    return (
        <div style={{height: theHeight, width: theWidth}} className="variable-spacer"></div>
    )
}