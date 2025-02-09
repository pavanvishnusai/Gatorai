import React from 'react';
import { AppBar } from '@mui/material';
import { Toolbar } from '@mui/material';
import Logo from './shared/Logo';
import { useAuth } from '../contexts/AuthContext';
import NavigationLink from './shared/NavigationLink';

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar sx={{bgcolor:"transparent", boxShadow: "none", position: "static"}}>
        <Toolbar sx={{display: "flex"}}>
            <Logo/>
            <div>
              {auth?.isLoggedIn?
              (
                <>
                  <NavigationLink 
                    bg="#00fffc" 
                    to ="/chats" 
                    text="Go To Chat" 
                    textcolor="black"
                  />
                  <NavigationLink
                    bg="#51538f" 
                    to ="/" 
                    text="Logout" 
                    textcolor="white"
                    onClick={auth.logout}
                  />
                </>
              ):
              (
                <>
                  <NavigationLink 
                    bg="#00fffc" 
                    to ="/login" 
                    text="Login" 
                    textcolor="black"
                  />
                  <NavigationLink 
                    bg="#51538f" 
                    to ="/signup" 
                    text="Signup" 
                    textcolor="white"
                  />
                </>
              )}
            </div>
        </Toolbar>
    </AppBar>
    
  )
}

export default Header