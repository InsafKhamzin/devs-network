import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import './nav-bar.css';

const Navbar = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" color="inherit" className="logo">
                        DevNetwork
                    </Typography>

                    <div className="nav">
                        <Link className="nav-link" to="/" >
                            <Button color="inherit">Developer</Button>
                        </Link>

                        <Link className="nav-link" to="/register" >

                            <Button color="inherit">Register</Button>
                        </Link>

                        <Link className="nav-link" to="/login">
                            <Button color="inherit">Login</Button>
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;