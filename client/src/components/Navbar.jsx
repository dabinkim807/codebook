import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Logo from '../assets/Logo_nbg.png'; 

import LoginButton from './auth0/LoginButton';
import LogoutButton from './auth0/LogoutButton';
import Profile from './auth0/Profile';
import { useAuth0 } from "@auth0/auth0-react";

function MyNavBar() {
  const { isAuthenticated } = useAuth0();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0 }}>
            <img
              id="logo"
              src={Logo}
              alt="CodeBook logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }  }}>
            <IconButton sx={{ p: 0 }}>
              <Profile />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Container >
              {!isAuthenticated ? (<LoginButton />) : (<LogoutButton />)}
            </Container>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MyNavBar;