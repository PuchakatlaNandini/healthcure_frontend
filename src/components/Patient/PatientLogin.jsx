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

const PatientLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // const response = await fetch('http://localhost:5000/api/users/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Login failed');
      const { data } = await axiosInstance.post('/users/login', formData);

      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      if (onClose) onClose();
      navigate('/patient/dashboard');
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
        px:2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
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
          Patient Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Grid container spacing={2} direction="column" alignItems={'center'}>
            <Grid item xs={12} size={8}>
              <TextField
                label="Email"
                name="email"
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

            <Grid item xs={12} size={6}>
              <Button variant="contained" fullWidth type="submit">
                Login
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="text"
                fullWidth
                onClick={() => navigate('/patient/register')}
              >
                New user? Register here
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PatientLogin;
