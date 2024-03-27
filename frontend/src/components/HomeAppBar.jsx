import React, { useState, useEffect, useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import witLogo from './../assets/witlogo.png';
import { Outlet, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Avatar from '@mui/material/Avatar';
import {UserContext} from './UserContext.jsx';

const HomeAppBar = () => {
  const {userInfo, setUserInfo} = useContext(UserContext);
  const [displayName,setDisplayName] = useState('');

  useEffect(() => {
    console.log("context changed");
    const displayNameFromCookie = Cookies.get('displayName');
        setDisplayName(displayNameFromCookie);
  }, [userInfo]);

  const handleLogout = () => {
    Cookies.remove('displayName'); // Clear the display name cookie
    Cookies.remove('token'); // Clear the display name cookie

    setUserInfo(null); // Clear the display name in state
    window.location.reload();

  };

  return (
    <>
      <AppBar style={{ backgroundColor: 'grey'}}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , height: '10vh'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/home"> <img src={witLogo} className="logo" alt="WIT logo" width="67" style={{paddingTop:'3vh'}} /></Link>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'inherit', marginLeft: '8px' }}>
              <Link to="/home" style={{color: 'white'}}>RateMyWIT</Link>
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: "center"}}>
          <Link to="/home" className="link"> <Button color="inherit" sx={{ color: 'white' }}>Home</Button></Link>

            <Link to="/review" className="link"> <Button color="inherit" sx={{ color: 'white' }}>Review</Button></Link>
            {displayName ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>Logout</Button>
                <Avatar sx={{ bgcolor: 'orange', marginRight: '8px', marginLeft: '40px' }}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body1" color="inherit" sx={{ marginRight: '1rem' }}>
                  {displayName}
                </Typography>
              </div>
            ) : 
            <Link to="/login" className="link"> <Button color="inherit" sx={{ color: 'white' }}>Login</Button></Link>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
  };

export default HomeAppBar;
