import React from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Container
} from "@mui/material";
import Navbar from "../headers/Navbar";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';

export default function LandingPage() {
  return (
    <Box sx={{ overflowX: 'hidden',width:'100%', }} >
      <Navbar />

      <Box
        sx={{
          width: '100%',
          backgroundColor: 'lightblue',
          textAlign: 'center',
          py: { xs: 8, sm: 10, md: 14 },
          px: { xs: 2, sm: 4},
                }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: {
              xs: '1.6rem',
              sm: '2.4rem',
              md: '3rem',
              lg: '3.5rem'
            }
          }}
        >
          Your Health, <span style={{ color: '#1e88e5' }}>Our Priority</span>
        </Typography>

        <Typography
          sx={{
            mt: 2,
            maxWidth: '700px',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            fontSize: {
              xs: '0.9rem',
              sm: '1rem',
              md: '1.1rem'
            }
          }}
        >
          Connect with qualified doctors, book appointments instantly, and get the healthcare you deserve. CareConnect makes quality healthcare accessible to everyone.
        </Typography>
      </Box>

      <Box sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 4 } }}>
        <Typography
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 5,
            fontSize: {
              xs: '1.4rem',
              sm: '1.7rem',
              md: '2rem'
            }
          }}
        >
          Why Choose CareConnect?
        </Typography>

        <Container maxWidth="lg"sx={{ overflowX: 'hidden' }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mx: 'auto', mb: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography fontWeight="bold">Qualified Doctors</Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified healthcare professionals
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#e8f5e9', color: '#388e3c', mx: 'auto', mb: 2 }}>
                  <CalendarMonthIcon />
                </Avatar>
                <Typography fontWeight="bold">Easy Booking</Typography>
                <Typography variant="body2" color="text.secondary">
                  Book appointments in seconds
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#f3e5f5', color: '#8e24aa', mx: 'auto', mb: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography fontWeight="bold">Secure & Private</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your health data is protected
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: '#fff3e0', color: '#fb8c00', mx: 'auto', mb: 2 }}>
                  <FavoriteBorderIcon />
                </Avatar>
                <Typography fontWeight="bold">24/7 Support</Typography>
                <Typography variant="body2" color="text.secondary">
                  Healthcare when you need it
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
