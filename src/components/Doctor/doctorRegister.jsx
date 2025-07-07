import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { toast } from "react-toastify";

export default function DoctorRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/doctors/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/doctor-login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          width: { xs: "90vw", sm: "80vw", md: "50vw", lg: "30vw" },
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <span
          className="close-button"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 10,
            right: 20,
            fontSize: 28,
          }}
        >
          &times;
        </span>

        <Typography variant="h5" mb={3}>
          Doctor Registration
        </Typography>

        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item xs={12} size={8}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} size={8}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={form.password}
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
            <Button
              variant="contained"
              onClick={handleRegister}
              fullWidth
            // disabled={!form.email || !form.password}
            >
              Register
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="text" onClick={() => navigate("/doctor-login")} fullWidth>
              Back to Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
