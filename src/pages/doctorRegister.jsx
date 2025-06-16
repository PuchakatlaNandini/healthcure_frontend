import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import axios from "axios";

export default function DoctorRegister() {
  const [form, setForm] = useState({
    
    email: "",
    password: "",
   
      });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/doctor-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
    }}>
      <Box sx={{ p: 4, textAlign: "center", width: '40vw', border: "1px solid #ccc", borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}>
        <Typography variant="h5" mb={3}>Doctor Registration</Typography>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {Object.keys(form).map((key) => (
            <Grid item xs={12} key={key}>
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                type={key === "password" ? "password" : "text"}
                fullWidth
                value={form[key]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleRegister}>Register</Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="text" onClick={() => navigate("/doctor-login")}>Back to Login</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
