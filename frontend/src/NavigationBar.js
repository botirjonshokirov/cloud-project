import React from 'react'
import { Link } from 'react-router-dom'
const NavigationBar = () => (
    <nav>
        <ul>
            <li>
                <Link to="/">HOME</Link>
            </li>
            <li>
                <Link to="/build-your-own">BUILD YOUR PC</Link>
            </li>
            <li>
                <Link to="/about">ABOUT US</Link>
            </li>
            <li>
                <Link to="/contacts">CONTACTS</Link>
            </li>
            <li>
                <Link to="/builds">FEATURED BUILDS</Link>
            </li>
        </ul>
    </nav>
)

export default NavigationBar