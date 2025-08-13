import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";

export default function DoctorLogin({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/doctors/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      const { token, role, isProfileComplete, name, doctorId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("doctorName", name);
      // localStorage.setItem("doctorImage",image)
      if (doctorId) {
        localStorage.setItem("doctorId", doctorId);
      }
      if (role === "doctor") {
        if (isProfileComplete) {
          console.log("isProfileComplete:", response.data.isProfileComplete);

          console.log("Navigating to /dashboard");
          navigate("/dashboard");
        } else {
          console.log("Navigating to /doctor/profile");
          navigate("/doctor/profile");
        }
      } else {
        console.log("Navigating to /");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
          onClick={() => {
            if (typeof onClose === 'function') {
              onClose();
            } else {
              navigate("/");
            }
          }}
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
          Doctor Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container direction="column" alignItems="center" spacing={2} >
            <Grid item xs={12} size={8}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} size={8}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} size={8}>
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/doctor/register")}
              >
                New doctor? Register here
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
