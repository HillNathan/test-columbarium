import React from 'react';
import { withRouter, Link } from "react-router-dom";

function PageOne () {
    return (
        <div>
            <h2>Page One goes here.</h2>
            <hr />
            <table>
                <tr>
                    <td> <Link to={"/"} label={"Main"}> Main </Link> </td>
                    <td>  Page One </td>
                    <td> <Link to={"/pagetwo"} label={"Page Two"}> Page Two </Link> </td>
                </tr>
            </table>
        </div>
    )
}

export default withRouter(PageOne)