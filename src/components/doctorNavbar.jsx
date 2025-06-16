import React from "react";
import Box from '@mui/material/Box';
import '../styles/Navbar.css';
import Button from "@mui/material/Button";

import {  Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';



export default function DoctorNavbar() {
  const handleLogout = () => {
    // localStorage.removeItem('token');
    // window.location.href = '/login';
  };

  return (
    <Box className="navbar-wrapper">
      <Box className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="../images/image.png" alt="Healthcure" width={300} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2">
            Welcome Doctor
          </Typography>

          <Button
            variant="outlined"

            startIcon={<LogoutIcon />}
            onClick={()=>{handleLogout()}}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    
    </Box>
  );
}
