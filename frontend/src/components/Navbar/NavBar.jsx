import React from 'react';
import {Link} from "react-router-dom";

export const NavBar = () => {
    return (
        <>
            <ul className={'navbar'}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/history">History</Link>
                </li>
            </ul>
        </>
    );
};
