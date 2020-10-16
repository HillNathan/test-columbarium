import React from 'react';
import { withRouter, Link } from "react-router-dom";

function PageTwo () {
    return (
        <div>
            <h2>Page Two goes here.</h2>
            <hr />
            <table>
                <tr>
                    <td> <Link to={"/"} label={"Main"}> Main </Link> </td>
                    <td> <Link to={"/pageone"} label={"Page One"}> Page One </Link> </td>
                    <td> Page Two </td>
                </tr>
            </table>
        </div>
    )
}

export default withRouter(PageTwo)

