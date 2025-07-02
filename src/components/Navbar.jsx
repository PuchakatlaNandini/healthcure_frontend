import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DoctorLogin from '../pages/doctorLogin';
import PatientLogin from '../pages/PatientLogin';

const Navbar = () => {
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(false);

  return (
    <>
      <AppBar position="static" color="white" elevation={1} sx={{ p: 0, m: 0 }}>
        <Toolbar sx={{ minHeight: 80, px: { xs: 3, sm: 8 }, p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <img src="/images/image.png" alt="Healthcure" style={{ width: 250, height: 48 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="primary" variant="outlined" sx={{ mr: 1, minWidth: 90 }} onClick={() => setShowPatientLogin(true)}>
            Patient Login
          </Button>
          <Button color="primary" variant="contained" sx={{ minWidth: 90 }} onClick={() => setShowDoctorLogin(true)}>
            Doctor Login
          </Button>
        </Toolbar>
      </AppBar>
      {showDoctorLogin && <DoctorLogin onClose={() => setShowDoctorLogin(false)} />}
      {showPatientLogin && <PatientLogin onClose={() => setShowPatientLogin(false)} />}
    </>
  );
};

export default Navbar;