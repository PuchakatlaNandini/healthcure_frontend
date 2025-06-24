import React from "react";
import Box from '@mui/material/Box';
import '../styles/Navbar.css';
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

export default function DoctorNavbar() {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  // Debug log to check what is in localStorage
  // console.log('DoctorNavbar: doctorName from localStorage =', doctorName);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('doctorName');
    navigate('/doctor/register');
  };

  return (
    <Box className="navbar-wrapper">
      <Box className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', minHeight: 60, maxHeight: 70, width: '100vw', boxSizing: 'border-box', overflow: 'hidden' }}>
        <img src="../images/image.png" alt="Healthcure" style={{ width: 250, maxWidth: '30vw', height: 'auto' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontSize: { xs: 12, sm: 16 } }}>
            Welcome {doctorName}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: { xs: 10, sm: 14 }, px: 2 ,mr:3}}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
