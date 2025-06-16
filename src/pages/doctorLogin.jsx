import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import axios from "axios";
// import DoctorProfile from "./doctorProfile";



export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/doctor/login", {
        email,
        password,
      });
console.log("Login successful:", response.data);
      const { token,  role,isProfileComplete} = response.data;
      console.log(role)
       localStorage.setItem("token", token);
         localStorage.setItem("role", role);

 if (role === "doctor") {
      if (isProfileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/doctor/profile");
      }
    } else {
      navigate("/");
    }

    } catch (error) {
    
      alert(error.response?.data?.message || "Login failed");
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
   <Box  sx={{ p: 4, textAlign: "center",width:'30vw' ,  border: "1px solid #ccc",
    borderRadius: 2,
    boxShadow: 3,          
    backgroundColor: "#fff",}}>
  <Typography variant="h5" mb={3}>Doctor Login</Typography>
  
  <Grid container direction="column" alignItems="center" spacing={2}>
    {/* Email Field */}
    <Grid item xs={12}>
      <TextField 
        label="Email" 
        fullWidth 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
    </Grid>

    {/* Password Field */}
    <Grid item xs={12}>
      <TextField 
        label="Password" 
        type="password" 
        fullWidth 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
    </Grid>

    {/* Login Button */}
    <Grid item xs={12}>
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Grid>
    {/* Register Button */}
    <Grid item xs={12}>
      <Button variant="outlined" onClick={() => navigate("/doctor/register")}>Register</Button>
    </Grid>
  </Grid>
</Box></Box>

  );
}
