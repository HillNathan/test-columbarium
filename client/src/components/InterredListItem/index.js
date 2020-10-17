import React from 'react';

const dateFunctions = require('../../datefunctions')

export default function SearchListItem(props) {
    //==================================================================================================
    //  Returns a block of text showing the information passed down through props in a 'person' object
    //==================================================================================================
    return(
        <li>{props.person.salutation} {props.person.firstName}  {props.person.middleName} {props.person.lastName} {props.person.suffix} <br></br>
        {(props.person.dateOfBirth === "") ? 
            <div></div>
          :
            <span>{dateFunctions.displayDate(props.person.dateOfBirth)} - {dateFunctions.displayDate(props.person.dateOfDeath)}</span>
        }
        </li>
        )
}