import React from 'react'
import { MapInteractionCSS } from 'react-map-interaction';
import PlotBox from '../PlotSquare'
import './style.css'

export default function PlotMap (props) {
    return (
        // This is the component that gives the plot map it's interactivity, zooming, dragging, and such. 
        <MapInteractionCSS>
            <table><tbody>
            {
            // in App.js, we set up the data being passed into this component in a very specific way so that
            //   when we receive it here - as an array of arrays each 22 items long - all we have to do is 
            //   run it through nested map loops and display each individual item using a custom component.
                props.plotList.map((thing1, index) => {
                    return (
                    <tr key={index} className="map-cell">
                        {thing1.map(thing2 => {
                            return (
                            <td key={thing2.id}>
                            <PlotBox 
                                handleOpen={props.handleOpen}
                                clickable={thing2.clickable}
                                theClass={thing2.status.toLowerCase()}
                                display={thing2.displayName}
                                name={thing2.reservedBy}
                                id={thing2.id}
                                plot={thing2.plotNumber}
                                status={thing2.status}
                            /></td>
                            )} 
                        )}
                    </tr>
                    )
                })}
            </tbody></table>
        </MapInteractionCSS> 
    )
}