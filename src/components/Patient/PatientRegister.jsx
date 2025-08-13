import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../utils/axios';

const PatientRegister = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('currentUser', JSON.stringify(data));
      if (onClose) onClose();
      navigate('/patient/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '90%',
          maxWidth: 400,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <span
          onClick={() => (typeof onClose === 'function' ? onClose() : navigate('/'))}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: 10,
            right: 20,
            fontSize: 28,
          }}
        >
          &times;
        </span>

        <Typography variant="h5" gutterBottom>
          Patient Registration
        </Typography>

        <form onSubmit={handleRegister}>
          <Grid container spacing={2} direction="column" alignItems={'center'}>
            <Grid item xs={12} size={8}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} size={8}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} size={8}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error" fontSize="0.9rem">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" fullWidth type="submit">
                Register
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="text"
                fullWidth
                onClick={() => navigate('/patient/login')}
              >
                Back to Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PatientRegister;
