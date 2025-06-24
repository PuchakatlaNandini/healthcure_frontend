import Box from "@mui/material/Box"
import Navbar from "../components/Navbar"
import Typography from "@mui/material/Typography"
import '../styles/page.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';




export default function LandingPage() {
  return (
    <Box>
      <Navbar />
      <Box sx={{
        width: '100%',
        margin: 0, padding: 0,
        backgroundColor: 'lightblue',
        textAlign: 'center',
        py: 25,
        minHeight: '30vh',
      }}>

        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          Your Health, <span style={{ color: '#1e88e5' }}>Our Priority</span>
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, maxWidth: 700, mx: 'auto' }}>
          Connect with qualified doctors, book appointments instantly, and get the healthcare you deserve. CareConnect makes quality healthcare accessible to everyone.
        </Typography>
      </Box>


      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 6 }}>
          Why Choose CareConnect?
        </Typography>

        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mx: 'auto', mb: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Qualified Doctors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified healthcare professionals
              </Typography>
            </Box>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#e8f5e9', color: '#388e3c', mx: 'auto', mb: 2 }}>
                <CalendarMonthIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Easy Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Book appointments in seconds
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#f3e5f5', color: '#8e24aa', mx: 'auto', mb: 2 }}>
                <SecurityIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Secure & Private
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your health data is protected
              </Typography>
            </Box>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#fff3e0', color: '#fb8c00', mx: 'auto', mb: 2 }}>
                <FavoriteBorderIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Healthcare when you need it
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
