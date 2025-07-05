// components/headers/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="white" elevation={1}>
      <Toolbar
        sx={{
          minHeight: 80,
          px: { xs: 2, sm: 6 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/image.png"
            alt="Healthcure"
            style={{ width: '100%', maxWidth: 200, height: 'auto' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            onClick={() => navigate("/patient/login")}
            sx={{ minWidth: 150, py: 1 }}
          >
            Patient Login
          </Button>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => navigate("/doctor-login")}
            sx={{ minWidth: 150, py: 1 }}
          >
            Doctor Login
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
