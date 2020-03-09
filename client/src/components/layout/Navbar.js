import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';

const Navbar = () => {
    return (
        <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit">
                    DevNetwork
                </Typography>
                <Button color="inherit">Developer</Button>
                <Button color="inherit">Register</Button>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        </div>
    )
}

export default Navbar;