import React from 'react';
import { withRouter, Link } from "react-router-dom";

function Main () {
    return (
        <div>
            <h2>Main Page goes here.</h2>
            <hr />
            <table>
                <tr>
                    <td> Main </td>
                    <td> <Link to={"/pageone"} label={"Page One"}> Page One </Link> </td>
                    <td> <Link to={"/pagetwo"} label={"Page Two"}> Page Two </Link> </td>
                </tr>
            </table>
        </div>
    )
}

export default withRouter(Main)