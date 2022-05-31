import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { AppBar, Toolbar } from '@material-ui/core';

import logo from './logo.png';

const Header = () => {
  return (
    <AppBar style={{ height: '64px' }} position="static">
      <Toolbar>
        <Link to="/">
          <Typography variant="h6" style={{ color: 'white' }}>
            La Berri BlindTest
          </Typography>
        </Link>
        <img src={logo} style={{ height: '40px', marginLeft: '10px' }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
